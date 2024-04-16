function buildStepFunction(service, stage, clientName) {

    return {
        "name": `${stage}-${clientName}-upload-pipeline`,
        "definition": {
            "StartAt": "Uploader",
            "States": {
                "Uploader": {
                    "Type": "Task",
                    "Resource": "arn:aws:states:::lambda:invoke.waitForTaskToken",
                    "Parameters": {
                        "FunctionName": `${service}-${stage}-${clientName}Upload`,
                        "Payload": {
                            "taskToken.$": "$$.Task.Token",
                            "input.$": "$"
                        }
                    },
                    "Next": "ContinueProcess",
                    "Catch": [
                        {
                            "ErrorEquals": [
                                "ProcessingFailed"
                            ],
                            "Next": "ProcessingFailed"
                        },
                        {
                            "ErrorEquals": [
                                "States.TaskFailed"
                            ],
                            "Next": "UnexpectedFailure"
                        }
                    ]
                },
                "ContinueProcess": {
                    "Type": "Succeed"
                },
                "ProcessingFailed": {
                    "Type": "Fail",
                    "Error": "Processing failed",
                    "Cause": "We caught a problem when processing so we should clean up the artifacts"
                },
                "UnexpectedFailure": {
                    "Type": "Fail",
                    "Error": "Unexpected failure",
                    "Cause": "Some unexpected error occurred, possibly a Lambda function exception, check logs"
                }
            }
        }
    }

}

module.exports = async ({ options, resolveVariable }) => {

    const stageVar = await resolveVariable('self:custom.stage')
    const serviceVar = await resolveVariable('self:service')

    const clients = [
        'inmarket'    ]

    const finalDefinitions = {
        "stateMachines": {
        }
    }

    for (let client of clients) {
        finalDefinitions.stateMachines[`${client}UploadPipeline`] = buildStepFunction(serviceVar, stageVar, client)
    }

    return finalDefinitions;

}

