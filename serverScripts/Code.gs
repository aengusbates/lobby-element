/*
* 1. Run setUp()
*    This will create 2 spreadsheets for logging: 'emailCampaignResults' and 'emailCampaignRememberedParticipants'
*    Before it runs it will ask you to authorise the script to send emails as you 
*    (so you ned to be signed in with the Google account from which you want the emails tobe sent)
* 2. Publish the script by clicking on the cloud icon or by opening the 'Publish' menu and selecting 'Deploy as web app...'
*    On the 'Deploy as web app' dialog select the following options:
*     'Project version': 'New'
*     'Execute the app as': 'Me'
*     'Who has access to the app':'Anyone, even anonymous'
* 3. Copy the URL displayed as 'Current web app URL:'. You will point to this from the PHP script on your local server.
*/

function doPost(e){
  Logger.log("doPost()");
 
  var success = false;
  var errorCodes = "";
  var json = JSON.parse(e.postData.contents);
  
  if(json){
    var subject = json.subject;
    var message = json.message;
    var sender_email = json.sender_email;
    var receiver_emails = json.receiver_emails;
    var firstname = json.firstname;
    var lastname = json.lastname;
    
    if(subject != undefined && subject != "" &&
       message != undefined && message != "" &&
       sender_email != undefined && sender_email != "" &&
       receiver_emails != undefined && receiver_emails != []
       ){
      // assuming that client does not send names if user does not want to be remembered
      if(firstname != "" && firstname != undefined  && lastname != "" && lastname != undefined ){
        logUserInfo(sender_email, firstname, lastname)
      }
    
      // replace line breaks with html '<br/>'
      // this step seems to be needed for email, but not for writing to docs
      message = message.replace(/(?:\r\n|\r|\n)/g, '<br>');
      
      message = "<img src='http://www.rugbytots.ie/images/charity.jpg' style='width:100%; margin-bottom:20px;'>" + message;
      
      for (var i = 0; i < receiver_emails.length; i++){
        //MailApp.sendEmail(receiver_emails[i], sender_email, subject, message);
        MailApp.sendEmail({
          to: receiver_emails[i],
          replyTo: sender_email,
          cc: sender_email,
          subject: subject,
          htmlBody: message
        });
        logEmail(sender_email, receiver_emails[i]);
      }
      
      success = true;
    } else{
      errorCodes = "Did not find expected fields in 'postData.contents'. Contents: " + json.join();
    }
    errorCodes = "Could not parse 'postData.contents'";
  }  
  var returnVal = {"success":true, "error-codes":errorCodes};

  return ContentService.createTextOutput(JSON.stringify(returnVal))
  .setMimeType(ContentService.MimeType.JSON);
}

function logEmail(sender_email, receiver_email){
  var url = PropertiesService.getScriptProperties().getProperty('emailLogSheet_url');
  var sheet = SpreadsheetApp.openByUrl(url);
  
  sheet.appendRow([Date(), sender_email, receiver_email]);
}

function logUserInfo(sender_email, firstname, lastname){
  var url = PropertiesService.getScriptProperties().getProperty('userLogSheet_url'); 
  var sheet = SpreadsheetApp.openByUrl(url);
  
  sheet.appendRow([Date(), sender_email, firstname, lastname]);
}


function createEmailLogSheet(){
  var sheet = SpreadsheetApp.create('emailCampaignResults');
  sheet.appendRow(['date', 'sender_email', 'receiver_email']);
  
  // apply rules to columns - data is not rejected if rules are not met
  // getRange(row, column, numRows)
  var sheet1 = sheet.getActiveSheet();
  var range = sheet1.getMaxRows() - 1;
  var daterange = sheet1.getRange(2, 1, range);
  var senderEmailrange = sheet1.getRange(2, 2, range);
  var receiverEmailrange = sheet1.getRange(2, 3, range);
  
  var emailRule = SpreadsheetApp.newDataValidation().requireTextIsEmail().build();
  var dateRule = SpreadsheetApp.newDataValidation().requireDate().build();
  
  daterange.setDataValidation(dateRule);
  senderEmailrange.setDataValidation(emailRule);
  receiverEmailrange.setDataValidation(emailRule);
  
  PropertiesService.getScriptProperties().setProperty('emailLogSheet_url', sheet.getUrl());
}

function createUserLogSheet(){
  var sheet = SpreadsheetApp.create('emailCampaignRememberedParticipants');
  sheet.appendRow(['date', 'email', 'firstname', 'surname']);
  
  PropertiesService.getScriptProperties().setProperty('userLogSheet_url', sheet.getUrl());
}

function setUp(){
  createUserLogSheet();
  createEmailLogSheet();
}



