<?php
header('Content-Type: application/json');

main();

function main()
{
    $success = false;
    $capachaResponse = verifyCaptcha();
    $curlResponse = array();

    if($capachaResponse){
        if ($capachaResponse->success)
        {
            $curlResponse = sendEmail(); 
            if($curlResponse){
               $success = $curlResponse["success"];
            }   
        }
    }

    print json_encode(array("success" => $success, 
            "capachaResponse" => $capachaResponse, 
            "curlResponse" => $curlResponse));
}

function sendEmail()
{
    $postData = file_get_contents("php://input");

    $url = "path_to_google_web_app";

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array( 'Content-Type: application/json')); 
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);                                                                   

    $response = curl_exec($ch);
    $responseJson = json_decode($response, true);

    $curlSuccess = true;
    $curlError = "";
    if(!$response)
    {
        $curlSuccess = false;
        $curlError =  curl_error($ch);
    }

    curl_close($ch);

    // $success = apps script success and curl success
    $success = $response && $responseJson["success"];

    return array("success" => $success, 
        "curlResponse" => array("success" => $curlSuccess, "error-codes" => $curlError), 
        "appsScriptResponse" => array("success" => $responseJson["success"], "error-codes" => "error-codes"));
}

function verifyCaptcha()
{
    $json = file_get_contents("php://input");
    $jsonData = json_decode($json, true);
    $captcha = $jsonData["g-recaptcha-response"];

    $secret='your_secret';

    $response=file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=".$secret."&response=".$captcha."&remoteip=".$_SERVER['REMOTE_ADDR']);
    $responseData = json_decode($response);


    return $responseData;
}

?>