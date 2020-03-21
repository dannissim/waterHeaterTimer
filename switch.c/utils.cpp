#include "utils.h"

namespace utils{


    void RGB_color(bool red_light_value, bool green_light_value, bool blue_light_value)
    {
    digitalWrite(RED_LED_PIN, red_light_value);
    digitalWrite(GREEN_LED_PIN, green_light_value);
    digitalWrite(BLUE_LED_PIN, blue_light_value);
    }

    void updateUI(Status_e state)
    {
    if (state==Status_e::WIFI_DISCONNECTED){
        RGB_color(true,0,0);
    }
    if (state==Status_e::HEATER_ON){
      RGB_color(0,true,0);
    }
    if (state==Status_e::HEATER_OFF){
      RGB_color(0,0,0);
    }
    if (state==Status_e::INVALID_SERVER_RESPONSE){
      RGB_color(true,0,0);
    }
    if (state==Status_e::UNKOWN){
      RGB_color(true,0,0);
    }
    delay(ERROR_LED_MINIMAL_DISPLAY_TIME);
    }

    void attemptWifiConnection()
    {
        while (WiFi.status() != WL_CONNECTED) 
        {
        utils::updateUI(Status_e::WIFI_DISCONNECTED);
        delay(1000);
        Serial.println("Connecting to WiFi..");
        WiFi.begin(ssid, password);
        }
        utils::updateUI(Status_e::WIFI_CONNECTED);
    }
}
