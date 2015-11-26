[See demo here](http://aengusbates.github.io/lobby-element/components/lobby-element/demo/)

##&lt;lobby-element&gt;
`lobby-element` is a Polymer Web component containing a simple contact form allowing users to email their representatives. The form allows users to search for their representatives by constituency and to edit and send them an email.

This doc will describe how to integrate it into your Web page and how to configure the server scripts (PHP and Google Apps Script).

##Configuration

###Frontend
  1. Include `webcomponents-lite.min.js` and `lobby-element.html` in the header.
  
  2. Assign values for `email-url`, `enable-platforms` and `twitter-user` values. 
    - `email-url` specifies the location of the PHP script on your server. You can find this script in the repo at `lobby-element/serverScripts/sendEmail.php`.
    - `twitter-user` and `enable-platforms` are optional. The values are passed straight through to [`social-element`](https://github.com/aengusbates/social-element) which can be removed if not needed. Please see the `social-element` project for more on configuration.

    **Example**
    
        <html>
          <head>
            <script src="../../webcomponentsjs/webcomponents-lite.min.js"></script>
            <link rel="import" href="../lobby-element.html">
          </head>
          <body unresolved>
        
            <lobby-element email-url="your_email_url" enable-platforms="email, facebook, twitter" twitter-user="your_twitter_user">
            </lobby-element>
        
          </body>
        </html>

  3. Assign a value for Recaptcha `data-sitekey` in `lobby-element.html`. 
    - Keys can be generated at [https://www.google.com/recaptcha/admin#list](https://www.google.com/recaptcha/admin#list).
    - Open `lobby-element.html` in a text editor and replace the placeholder text for the value of `data-sitekey` with the new sitekey you have generated.
  
    - Note: This step is a temporary work-around value could not be exposed as a property. This means that if you update your dependencies with Bower after modifying the file your changes will be overwritten and you will have to repeat the steps.
  
  4. Update the `reps.json` file. 
    - This is an array of objects. Each object has three properties: 'constituency', 'name', and 'email'.
    - If you have compiled your data in *Microsoft Excel* or *Numbers for Mac* you will need to save it as a *.csv* file and then convert it to a *.json* file using `convertCsvToJson.py` located in the `lobby-element/tools`.
      1. Open you file in Excel or Numbers and make sure the first row contains headers named 'constituency', 'name', and 'email'. (It can also contain other headers, but there are the only ones of interest)
      2. Save the content as *'reps.csv'* in `lobby-element/tools`.
        - You can find the steps saving as a *.csv* file [here for Microsoft Excel](https://support.office.com/en-za/article/Import-or-export-text-txt-or-csv-files-5250ac4c-663c-47ce-937b-339e391393ba#bmexport) and [here for Numbers](https://support.apple.com/kb/PH14848?locale=en_US).
      3. Open *Terminal* or *Command Prompt* navigate to `lobby-element/tools` which now contains two files: *'reps.csv'* and `convertCsvToJson.py`. Run the script. This will create a new file called *'reps.json'*
    
                $ python convertCsvToJson.py

      4. Copy the new *'reps.json'* from `lobby-element/tools` to `lobby-element/config`.
  
  5. Update the `config/emailSubject.txt`, `config/emailMessage.txt` and `config/campaignBlurb.txt` files.
  - This blurb text allows for a brief description of the campaign which is not user editable.
  - This subject and message text is pre-populated in the form and is user editable.

###Backend
  1. Google Apps script 
    1. Go to [script.google.com](script.google.com) 
    2. Paste in the contents of `lobby-element/serverScripts/Code.gs` and save the file.
    3. Run setUp()
      - This will create 2 spreadsheets for logging: 'emailCampaignResults' and 'emailCampaignRememberedParticipants'
      - Before it runs it will ask you to authorise the script to send emails as you (so you ned to be signed in with the Google account from which you want the emails tobe sent)
    4. Publish the script by clicking on the cloud icon or by opening the 'Publish' menu and selecting 'Deploy as web app...'
      - On the 'Deploy as web app' dialog select the following options:
        - 'Project version': 'New'
        - 'Execute the app as': 'Me'
        - 'Who has access to the app':'Anyone, even anonymous'
    5. Copy the URL displayed as 'Current web app URL:'. You will point to this from the PHP script on your local server.
  
  2. PHP file
    1. Open the php file in a text editor. It is located at `lobby-element/serverScripts/sendEmail.php`.
    2. Replace the placeholder text for the value of `$secret` with the new Recaptcha secret you have generated.
    3. Replace the placeholder text for `$url` to point to AppScript
    4. Deploy the scrit on your server and pass the value `<lobby-element>` into as `email-url`.

## Setting up your users
* **Google user**
  - You will need to register a [Google Apps](https://apps.google.com) account here: https://www.google.com/a/signup
  - You will need to enable billing. Follow the steps here: https://cloud.google.com/appengine/docs/developers-console/#billing
    - You not need to pay for usage below the quota of 100 messages	per day and 8 messages per minute.
    - **Note: When you enable billing, the email quota remains at 100 messages per day. You must explicitly request a higher mail quota. [[ref]](https://cloud.google.com/appengine/docs/quotas#up_mail_quota)**

## Checking out and running the code

While you can download this project as a .zip file, it will not run without its dependencies which are managed via [Bower](http://bower.io/). 

  - To install bower run the following command in your terminal:

        $ npm install -g bower
    
    Note: Bower requires node, npm and git. For more info go to [http://bower.io/](http://bower.io/).

  - You can now download `lobby-element` and its dependencies:

        $ bower install -save aengusbates/lobby-element
    
  - You can verify that the element is displaying correctly locally by running the Python's simple server.

        $ python -m SimpleHTTPServer

  This starts a web server on port 8000, so you can test your the element by navigating a browser to the URL localhost:8000/bower_components/lobby_element/demo/.
