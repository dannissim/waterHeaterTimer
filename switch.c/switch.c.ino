#include <WiFi.h>
#include <HTTPClient.h>

#include "utils.h"
#include "config.h"
#include "heater.h"
#include "mdns.h"
#include "mdnsUtils.h"


auto serverIP = FALLBACK_SERVER_IP;
void setup() {
 
  Serial.begin(BAUD_RATE);
  delay(4000);

  utils::attemptWifiConnection();
  Serial.println("Connected to the WiFi network");

  pinMode(RED_LED_PIN, OUTPUT);
  digitalWrite(RED_LED_PIN, LOW);
  pinMode(BLUE_LED_PIN, OUTPUT);
  digitalWrite(BLUE_LED_PIN, LOW);
  pinMode(GREEN_LED_PIN, OUTPUT);
  digitalWrite(GREEN_LED_PIN, LOW);
  pinMode(HEATER_CONTROL_PIN, OUTPUT);
  digitalWrite(HEATER_CONTROL_PIN, LOW);
  mdns::start_mdns_service();
  auto foundIP = mdns::resolve_mdns_host(SERVER_HOST);
  if (foundIP != "" && serverIP != "%d.%d.%d.%d") {
    Serial.println("Resolved Server IP:" + foundIP);
    serverIP = foundIP;
  }
  
  
}


void loop() {
  if ((WiFi.status() != WL_CONNECTED)) {
    utils::attemptWifiConnection();
    return;
  }
  auto heaterController = Heater(HEATER_CONTROL_PIN, String("http://") + serverIP);
  Serial.print("Checking heater status");
  auto heaterStatus = heaterController.updateStatus();
  
  if (heaterStatus  == Status_e::INVALID_SERVER_RESPONSE || heaterStatus  == Status_e::UNKOWN){
    serverIP = mdns::resolve_mdns_host(SERVER_HOST);
    Serial.print(String("Resolved server IP:") + serverIP);
    if (serverIP == "" || serverIP == "%d.%d.%d.%d"){
      Serial.print("No server IP found, falling back to:" + FALLBACK_SERVER_IP);
      serverIP = FALLBACK_SERVER_IP;
    }
  }
  utils::updateUI(heaterStatus);

}
