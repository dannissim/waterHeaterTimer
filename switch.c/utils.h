#pragma once

#include <WiFi.h>
#include <HTTPClient.h>
#include "config.h"

enum Status_e {
 WIFI_DISCONNECTED,
 WIFI_CONNECTED,
 HEATER_ON,
 HEATER_OFF,
 INVALID_SERVER_RESPONSE,
 UNKOWN
};

namespace utils{
  void attemptWifiConnection();
  void updateUI(Status_e state);
  void RGB_color(bool red_light_value, bool green_light_value, bool blue_light_value);
}
