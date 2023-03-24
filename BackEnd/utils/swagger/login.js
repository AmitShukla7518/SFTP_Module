const loginSwagger={
    paths : {
        "/login/social" : {
            "post": {
                "tags": [
                    "login"
                ],
                "summary": "Login using social media auth response",
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
                "parameters": [
                    {
                        "in": "body",
                        "name": "body",
                        "description": "Request Object",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/login-social"
                        }
                    }
                ]
            }
        }
    },
    definitions : {
        "login-social" : {
            "properties": {
                "social_id": {
                    "type": "string",
                    "description" : "Socail id got from facebook/gmail."
                },
                "email": {
                    "type": "string",
                    "description" : "Email id used to authorize for login."
                },
                "verified_email": {
                    "default" : "true",
                    "type": "boolean",
                    "description" : "Verifies as true in case of social login."
                },
                "name": {
                    "type": "string",
                    "description" : "Name of user."
                },
                "picture": {
                    "type": "string",
                    "description" : "Link of Profile image of user got from social login auth"
                },
                "source" : {
                    "type" : "string",
                    "default" : "GMAIL",
                    "description" : "Login source ['GMAIL','FACEBOOK']"
                },
                "meta" : {
                    "type" : "array",
                    "items" : {
                        "type" : "object",
                        "properties" : {
                            "tu_meta_group" : {
                                "type" : "string"
                            },
                            "tu_meta_key" : {
                                "type" : "string"
                            },
                            "tu_meta_val" : {
                                "type" : "string"
                            },
                        }
                    },
                    "description" : "Array of meta info of user got from social login"
                }

            }
        }
    }
}
module.exports = loginSwagger