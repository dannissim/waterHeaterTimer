#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

#include "heater.h"
#include "config.h"


Heater::Heater(int heaterControlPin, String serverUrl)
    : m_heaterControlPin(heaterControlPin)
    , m_serverUrl(serverUrl)
    , m_heaterStatus(Status_e::UNKOWN)
{

}
Status_e Heater::updateStatus()
{
  
  auto serverStatus = checkServerStatus(m_serverUrl);
  if (serverStatus == Status_e::HEATER_OFF || serverStatus == Status_e::INVALID_SERVER_RESPONSE) {
    turnOff();
  }

  if (serverStatus == Status_e::HEATER_ON) {
    turnOn();
  }
  m_heaterStatus = serverStatus;
  return serverStatus;

}

Status_e Heater::checkServerStatus(String serverUrl)
{
  HTTPClient http;
  http.begin((serverUrl + String("/api/status")).c_str());
  Serial.print("Requesting from server");
  int httpCode = http.GET(); 
  String payload = http.getString();
  http.end();
  Serial.println("Response: ");
  Serial.print(payload);
  
  Serial.println("Parsing response");
  DynamicJsonDocument doc(1024);
  deserializeJson(doc, payload.c_str());
  auto strDoc = doc["isOn"].as<String>();

  if (strDoc == String("true")){
    Serial.println("Heater on");
    return Status_e::HEATER_ON;
  }
  if (strDoc == String("false")) {
    Serial.println("Heater off");
    return Status_e::HEATER_OFF;  
  }
  Serial.println("Unrecognized response");
  return Status_e::INVALID_SERVER_RESPONSE;
  
}

Status_e Heater::turnOn()
{
  m_heaterStatus = Status_e::HEATER_ON;
  digitalWrite(5, INVERT_HEATER_RELAY ? LOW : HIGH);
}

Status_e Heater::turnOff()
{
  m_heaterStatus = Status_e::HEATER_OFF;
  digitalWrite(m_heaterControlPin, INVERT_HEATER_RELAY ? HIGH : LOW);
}
