

// exports.handler = async (event) => {
//     // TODO implement
//     const response = {
//         statusCode: 200,
//     //  Uncomment below to enable CORS requests
//     //  headers: {
//     //      "Access-Control-Allow-Origin": "*",
//     //      "Access-Control-Allow-Headers": "*"
//     //  }, 
//         body: JSON.stringify('Hello from Lambda!'),
//     };
//     return response;
// };


const getWimsAndOtherData = require('./getWimsAndOtherDataRefactor1EATest.js')

exports.handler = async (event) => {
    const response = {
        statusCode: 200,
    //  Uncomment below to enable CORS requests
    //  headers: {
    //      "Access-Control-Allow-Origin": "*",
    //      "Access-Control-Allow-Headers": "*"
    //  }, 
        body: JSON.stringify('Hello from Lambda!'),
    };
    try{
        const functionRun = await getWimsAndOtherData()
        response.functionResult = functionRun
    }
    catch(e){
        console.log('error', JSON.stringify(e))
        resonse.statusCode = 400
    }
    finally{

        // TODO implement
        console.log('response', response)
        return response;
    }
};
