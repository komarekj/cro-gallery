import Store from "@/models/Store";
import connectToDatabase from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ObjectId } from "mongodb";

// export async function generateStaticParams() {
//   await connectToDatabase();
//   const stores = await Store.find({}, '_id');
  
//   return stores.map((store) => ({
//     id: store._id.toString(),
//   }));
// }

export async function generateMetadata(props) {
  const { params } = props;
  await connectToDatabase();
  
  try {
    const store = await Store.findOne({ _id: new ObjectId(params.id) });
    
    if (!store) {
      return {
        title: "Site Not Found",
        description: "The requested site could not be found",
      };
    }
    
    return {
      title: `${store.domain} | CRO Case Study`,
      description: store.metadata?.description || store.description,
    };
  } catch (error) {
    return {
      title: "Invalid Site ID",
      description: "The requested site ID is invalid",
    };
  }
}

export default async function SitePage(props) {
  const { params } = props;
  await connectToDatabase();
  
  try {
    const store = await Store.findOne({ _id: new ObjectId(params.id) });
    
    if (!store) {
      notFound();
    }
    
    return (
      <main className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center mb-6 text-blue-600 hover:text-blue-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Gallery
        </Link>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 p-6 items-start">
            {/* Left column - Image */}
            <div className="md:w-2/5 flex justify-center">
              <div className="relative w-full h-80 md:h-auto bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden">
                <Image
                  src={`/images/sites/${params.id}.png`}
                  alt={store.domain}
                  width={600}
                  height={800}
                  className="w-full h-auto object-contain"
                />
                {/* {store.metadata?.screenshotUrl && !store.imageUrl && (
                  <Image
                    src={store.metadata.screenshotUrl}
                    alt={store.domain}
                    fill
                    className="object-cover"
                  />
                )} */}
              </div>
            </div>
            
            {/* Right column - Content */}
            <div className="p-6 md:p-8 md:w-3/5 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
                <h1 className="text-3xl font-bold">{store.domain}</h1>
                {store.category && (
                  <span className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
                    {store.category}
                  </span>
                )}
              </div>
              
              <a 
                href={`https://${store.domain}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Visit Website
              </a>
              
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-10">{store.metadata?.description || store.description}</p>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-10 mt-10">
                <h2 className="text-2xl font-bold mb-8">CRO Case Study</h2>
                
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  {store.analysis && store.analysis.content ? (
                    <div dangerouslySetInnerHTML={{ __html: store.analysis.content }} />
                  ) : store.metadata?.analysis ? (
                    <div className="space-y-10">
                      {store.metadata.analysis.persona && (
                        <div>
                          <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">Target Persona</h3>
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                            <h4 className="font-semibold text-lg">{store.metadata.analysis.persona.name}</h4>
                            <p>{store.metadata.analysis.persona.description}</p>
                          </div>
                        </div>
                      )}
                      
                      {store.metadata.analysis.benefits?.length > 0 && (
                        <div>
                          <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">Key Benefits</h3>
                          <div className="grid md:grid-cols-2 gap-6">
                            {store.metadata.analysis.benefits.filter(b => b.included).map((benefit, index) => (
                              <div key={index} className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg">
                                <h4 className="font-semibold text-lg">{benefit.name}</h4>
                                <p>{benefit.description}</p>
                                <div className="mt-4 bg-gray-100/80 dark:bg-gray-800/30 border-l-2 border-gray-400 dark:border-gray-600 p-4 rounded-r-lg flex items-start">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5 mr-2 flex-shrink-0 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                  </svg>
                                  <div>
                                    <span className="font-medium text-sm text-gray-600 dark:text-gray-400">Suggestion:</span>
                                    <p className="text-gray-700 dark:text-gray-300">{benefit.suggestion}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {store.metadata.analysis.differentiators?.length > 0 && (
                        <div>
                          <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">Unique Differentiators</h3>
                          <div className="grid md:grid-cols-2 gap-6">
                            {store.metadata.analysis.differentiators.filter(d => d.included).map((diff, index) => (
                              <div key={index} className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg">
                                <h4 className="font-semibold text-lg">{diff.name}</h4>
                                <p>{diff.description}</p>
                                <div className="mt-4 bg-gray-100/80 dark:bg-gray-800/30 border-l-2 border-gray-400 dark:border-gray-600 p-4 rounded-r-lg flex items-start">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5 mr-2 flex-shrink-0 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                  </svg>
                                  <div>
                                    <span className="font-medium text-sm text-gray-600 dark:text-gray-400">Suggestion:</span>
                                    <p className="text-gray-700 dark:text-gray-300">{diff.suggestion}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {store.metadata.analysis.objections?.length > 0 && (
                        <div>
                          <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">Common Objections</h3>
                          <div className="grid md:grid-cols-2 gap-6">
                            {store.metadata.analysis.objections.filter(o => o.included).map((objection, index) => (
                              <div key={index} className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg">
                                <h4 className="font-semibold text-lg">{objection.name}</h4>
                                <p>{objection.description}</p>
                                <div className="mt-4 bg-gray-100/80 dark:bg-gray-800/30 border-l-2 border-gray-400 dark:border-gray-600 p-4 rounded-r-lg flex items-start">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5 mr-2 flex-shrink-0 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                  </svg>
                                  <div>
                                    <span className="font-medium text-sm text-gray-600 dark:text-gray-400">Suggestion:</span>
                                    <p className="text-gray-700 dark:text-gray-300">{objection.suggestion}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {store.metadata.analysis.trust?.length > 0 && (
                        <div>
                          <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">Trust Elements</h3>
                          <div className="grid md:grid-cols-2 gap-6">
                            {store.metadata.analysis.trust.filter(t => t.included).map((trust, index) => (
                              <div key={index} className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg">
                                <h4 className="font-semibold text-lg">{trust.name}</h4>
                                <p>{trust.description}</p>
                                <div className="mt-4 bg-gray-100/80 dark:bg-gray-800/30 border-l-2 border-gray-400 dark:border-gray-600 p-4 rounded-r-lg flex items-start">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5 mr-2 flex-shrink-0 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                  </svg>
                                  <div>
                                    <span className="font-medium text-sm text-gray-600 dark:text-gray-400">Suggestion:</span>
                                    <p className="text-gray-700 dark:text-gray-300">{trust.suggestion}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {store.metadata.analysis.urgency?.length > 0 && (
                        <div>
                          <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">Urgency Elements</h3>
                          <div className="grid md:grid-cols-2 gap-6">
                            {store.metadata.analysis.urgency.filter(u => u.included).map((urgency, index) => (
                              <div key={index} className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg">
                                <h4 className="font-semibold text-lg">{urgency.name}</h4>
                                <p>{urgency.description}</p>
                                <div className="mt-4 bg-gray-100/80 dark:bg-gray-800/30 border-l-2 border-gray-400 dark:border-gray-600 p-4 rounded-r-lg flex items-start">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5 mr-2 flex-shrink-0 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                  </svg>
                                  <div>
                                    <span className="font-medium text-sm text-gray-600 dark:text-gray-400">Suggestion:</span>
                                    <p className="text-gray-700 dark:text-gray-300">{urgency.suggestion}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {store.metadata.analysis.crosssell?.length > 0 && (
                        <div>
                          <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">Cross-Sell Opportunities</h3>
                          <div className="grid md:grid-cols-2 gap-6">
                            {store.metadata.analysis.crosssell.filter(c => c.included).map((crosssell, index) => (
                              <div key={index} className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg">
                                <h4 className="font-semibold text-lg">{crosssell.name}</h4>
                                <p>{crosssell.description}</p>
                                <div className="mt-4 bg-gray-100/80 dark:bg-gray-800/30 border-l-2 border-gray-400 dark:border-gray-600 p-4 rounded-r-lg flex items-start">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5 mr-2 flex-shrink-0 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                  </svg>
                                  <div>
                                    <span className="font-medium text-sm text-gray-600 dark:text-gray-400">Suggestion:</span>
                                    <p className="text-gray-700 dark:text-gray-300">{crosssell.suggestion}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <p>
                        This is a placeholder for the detailed case study content. In a real application, this would contain 
                        in-depth information about the conversion rate optimization strategies implemented, 
                        the problems that were solved, methodologies used, and the results achieved.
                      </p>
                      
                      <h3 className="mt-6">Key Metrics</h3>
                      <ul>
                        <li>Conversion Rate: Improved by X%</li>
                        <li>Average Order Value: Increased by $X</li>
                        <li>Customer Retention: Improved by X%</li>
                      </ul>
                      
                      <h3 className="mt-6">Implementation Strategy</h3>
                      <p>
                        Placeholder for detailed implementation strategy information. This would include
                        the specific changes made to the website, the testing methodology, and how the
                        final solutions were developed and deployed.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    notFound();
  }
} 