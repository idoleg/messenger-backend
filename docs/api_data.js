define({ "api": [
  {
    "type": "post",
    "url": "/auth/login",
    "title": "Getting token in exchange for data credentials",
    "name": "Login",
    "group": "Auth",
    "permission": [
      {
        "name": "none"
      }
    ],
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User unique E-mail</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>User password</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "A JSON example:",
          "content": "{\n    \"email\": \"test@test.ru\",\n    \"password\": \"012345678\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>Credentials are wrong.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"message\": \"Credentials are wrong\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/Controllers/AuthController.ts",
    "groupTitle": "Auth",
    "sampleRequest": [
      {
        "url": "http://localhost:8080/auth/login"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>User auth token</p>"
          },
          {
            "group": "Success 200",
            "type": "User",
            "optional": false,
            "field": "user",
            "description": "<p>User Resource</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.id",
            "description": "<p>User unique id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.email",
            "description": "<p>User unique email</p>"
          },
          {
            "group": "Success 200",
            "type": "UserProfile",
            "optional": false,
            "field": "user.profile",
            "description": "<p>User Profile Resource</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.profile.username",
            "description": "<p>User unique username</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.profile.fullname",
            "description": "<p>User Profile fullname</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "user.profile.last_seen",
            "description": "<p>User last seen</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"token\": \"eyJhbGciI6IkpXVCJ9.eyJ1c2VySV4cCI6MTU1MTM1MjA1Mn0.rnQ4Kb03tL4e2DY\",\n    \"user\": {\n        \"id\": \"5c3cd7be0e590c3124b68b7a\",\n        \"email\": \"test@test.ru\",\n        \"profile\": {\n            \"username\": \"\",\n            \"fullname\": \"Ivan Nikolaev\",\n            \"last_seen\": null\n        }\n    }\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/auth/registration",
    "title": "Create new account for user",
    "name": "Registration",
    "group": "Auth",
    "permission": [
      {
        "name": "none"
      }
    ],
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User unique E-mail</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>User any name. Min length is 8 symbols. Max length is 32 symbols.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>User password. Min length is 8 symbols. Max length is 32 symbols.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "A JSON example:",
          "content": "{\n    \"email\": \"test@test.ru\",\n    \"name\": \"Ivan Nikolaev\",\n    \"password\": \"012345678\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Conflict",
            "description": "<p>This email has already existed.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 409 Conflict\n{\n  \"message\": \"This email has already existed\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/Controllers/AuthController.ts",
    "groupTitle": "Auth",
    "sampleRequest": [
      {
        "url": "http://localhost:8080/auth/registration"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>User auth token</p>"
          },
          {
            "group": "Success 200",
            "type": "User",
            "optional": false,
            "field": "user",
            "description": "<p>User Resource</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.id",
            "description": "<p>User unique id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.email",
            "description": "<p>User unique email</p>"
          },
          {
            "group": "Success 200",
            "type": "UserProfile",
            "optional": false,
            "field": "user.profile",
            "description": "<p>User Profile Resource</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.profile.username",
            "description": "<p>User unique username</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.profile.fullname",
            "description": "<p>User Profile fullname</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "user.profile.last_seen",
            "description": "<p>User last seen</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"token\": \"eyJhbGciI6IkpXVCJ9.eyJ1c2VySV4cCI6MTU1MTM1MjA1Mn0.rnQ4Kb03tL4e2DY\",\n    \"user\": {\n        \"id\": \"5c3cd7be0e590c3124b68b7a\",\n        \"email\": \"test@test.ru\",\n        \"profile\": {\n            \"username\": \"\",\n            \"fullname\": \"Ivan Nikolaev\",\n            \"last_seen\": null\n        }\n    }\n}",
          "type": "json"
        }
      ]
    }
  }
] });
