## API

https://add-to-event-x4so6zig6a-ew.a.run.app/form-definitions/

- This is an API which allows the user to create a form schema, which will be used to auto generate
form fields with clientside validation in multiple applications, e.g. React Web app
- It currently only supports two HTTP Methods
  - `POST` at `/form-definition/` 
    - e.g. ``{
      "formName": "Email",
      "fields": [
      {
      "key": "email",
      "placeholder": "Your email...",
      "title": "Your person email",
      "type": "textarea",
      "validation": {
      "required": true,
      "maxLength": 35,
      "validationMessage": "Email is Required"
      }
      }
      ]
      }``
  - `Get` at `/form-definition/{formName}`
    - e.g. `/form-definition/{email}` will return the email object from the database
- It uses firebase to store the data
- It uses Google Cloud Run as the environment, which is a managed k8s platform. 
- The source code is containerised via Docker and the image is deployed to the Google run k8s cluster using gcloud CLI
- It is fully tested using Jest, supertest, firestore emulator and the firebase testing SDK
- Makes use of Nestjs dynamic modules to share one instance of firestore database across whole app, also allows us to inject emulated db for testing

## To run locally
- `yarn install`
- `yarn start:dev`
- This will create the API service and run on port 3001
- Firebase emulator will run on port 3003, with its web UI running on port 3004
