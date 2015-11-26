##&lt;lobby-elementl&gt;

'lobby-element' displays a simple contact form allowing users to lobby their representatives. The form allows users to filter representatives by constituency and to edit and send them an email.

Example:

	<lobby-element email-url="path_to_server_side_email_script" twitter-user="your_twitter_username"></lobby-element>

###Properties
####email-url

This propeerty holds the path to the server-side script that the form is to be submitted to.

####twitter-user

This property is optional and is only required if wish to leave the social functionality inplace. It passes the value straight through to 'social-element'.

###Other configuration
####Recaptcha data-sitekey
[Google Recaptcha](https://www.google.com/recaptcha/intro/index.html) is in-use in the element. This requires a 'data-sitekey' for your domain. Keys can be generated here: [https://www.google.com/recaptcha/admin#list](https://www.google.com/recaptcha/admin#list). This value could not be exposed as a property and so has to be set in lobby-element.html. Please note that this means that if you update your dependencies with Bower at a laterdate that this file will be overwritten and that you will have to reinput the key. [TODO: Remove this workaround]

####
####config/reps.json
This is an array of objects. Each object has three properties: 'constituency', 'name', and 'email'.

####config/campaignBlurb.txt
This text allows for a brief discription of the campaign. This text is not user editable.

####config/emailMessage.txt
This text will be prepopulated in the form as the email body. This text is user editable.

####config/emailSubject.txt
This text will be prepopulated in the form as the email subject. This text is user editable.




