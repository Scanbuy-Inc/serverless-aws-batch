
'use strict';
import {BatchClient, SubmitJobCommand} from "@aws-sdk/client-batch";

const batch = new BatchClient({region: process.env.AWS_REGION});


export const schedule = async (event, context) => {
   
    const jobDefinition = process.env.JOB_DEFINITION_ARN;
    const jobName = process.env.FUNCTION_NAME + '-' + Date.now();
    const jobQueue = process.env.JOB_QUEUE_ARN;
  
    let params = {
        jobDefinition: jobDefinition,
        jobName: jobName,
        jobQueue: jobQueue,
        parameters: {
            event: JSON.stringify(event)
        }
    };

    const command = new SubmitJobCommand(params);

    console.log(`Submitting job: ${JSON.stringify(params, null, 2)}`);

     const response =await batch.send(command)
     if(response){
        console.log(`Submitted job: ${JSON.stringify(response, null, 2)}`);
        return ({
            statusCode: 200,
            body: JSON.stringify({
                response
            })
        })
     }
   
     return ({
            statusCode: 401,
            body: JSON.stringify({
                'error': "Job not submitted"
            })
    })

}