const planSwagger={
    paths : {
        "/plan" : {
            "get": {
                "tags": [
                    "plans"
                ],
                "summary": "Get All Active plans with feature",
                "produces": [
                    "application/json"
                ],
                "responses": {
                    "200": {
                        "description": "ok"
                    },
                    "400": {
                        "description": "Error message"
                    }
                },
                // "parameters": [
                //     {
                //         "in": "header",
                //         "name": "Authorization",
                //         "description": "Authorization token in form of: Bearer Token",
                //         "required": true
                //     }
                // ]
            }
        }
    },
    definitions : {
        
    }
}
module.exports = planSwagger