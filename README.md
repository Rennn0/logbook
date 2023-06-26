# BookingFrontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.11.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.


image: node:16             			                                     #Defines build container image

pipelines:																#Pipeline consists of 2 steps, first step builds and deploys the solution to gcp bucket, second step disable cache control on said container
branches:											
    master:																#Specifies which branch to build
      - step:															#Definition of first step
          name: Build and Deploy										#Name of the first step
          caches:														#Specifies to cache built files of node and docker
          - node
          - docker
          script:														#Definition of commands to be run on build container
            - cd src
            - npm install
            - npm run build -- --configuration=production --deploy-url=/
            - cd ../dist/booking-frontend
            - ls
            - pipe: atlassian/google-cloud-storage-deploy:1.0.1			#Pipeline used to deploy built files to GCP (for details refernce https://bitbucket.org/atlassian/google-cloud-storage-deploy/downloads/?tab=tags) 
              variables:												#Variables to be used for deployment pipeline, These variables are defined in repository variables
                KEY_FILE: $KEY_FILE
                PROJECT: $PROJECT
                ACL: "public-read"
                BUCKET: $BUCKET
                SOURCE: $SOURCE
                CACHE_CONTROL: max-age=0
      - step:															#Defenition of second step
          name: disable cache control									#Name of second step
          image: google/cloud-sdk:latest								#Docker image to be used for second step
          script:														#Definition of commands to be run on build container
            - echo -n $KEY_FILE | base64 -di > key.json
            - gcloud auth activate-service-account 541247734652-compute@developer.gserviceaccount.com --key-file=key.json
            - gcloud config set project frgg-1869
            - gsutil setmeta -r -h "Cache-control:max-age=0" gs://logbook-frontend
    dev:																#Specifies which branch to build
    - step:																#Definition of second step
        name: Build and Deploy											#Name of the first step
        caches:															#Specifies to cache built files of node and docker
          - node
          - docker
        script:															#Definition of commands to be run on build container
          - cd src
          - npm install
          - npm run build -- --configuration=production --deploy-url=/
          - cd ../dist/booking-frontend
          - ls
          - pipe: atlassian/google-cloud-storage-deploy:1.0.1			#Pipeline used to deploy built files to GCP (for details refernce https://bitbucket.org/atlassian/google-cloud-storage-deploy/downloads/?tab=tags) 
            variables:													#Variables to be used for deployment pipeline, These variables are defined in repository variables
              KEY_FILE: $KEY_FILE
              PROJECT: $PROJECT
              ACL: "public-read"
              BUCKET: $BUCKET_Dev
              SOURCE: $SOURCE
              CACHE_CONTROL: max-age=0
    - step:																#Defenition of second step
        name: disable cache control										#Name of second step
        image: google/cloud-sdk:latest									#Docker image to be used for second step
        script:															#Definition of commands to be run on build container
          - echo -n $KEY_FILE | base64 -di > key.json
          - gcloud auth activate-service-account 541247734652-compute@developer.gserviceaccount.com --key-file=key.json
          - gcloud config set project frgg-1869
          - gsutil setmeta -r -h "Cache-control:max-age=0" gs://logbook-frontend-dev
