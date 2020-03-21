#include "utils.h"

class Heater {
public:
    // Not passing the manual switch pin will skip the handeling of the manual switch
    Heater(int heaterControlPin, String serverUrl);
    //~Heater();
    // Assumes setting heaterPin to HIGH will turn the heater on. Handles main logic
    Status_e updateStatus();

    // Check if the server dictates that the boiler is supposed to be on or off
    Status_e checkServerStatus(String serverUrl);
    Status_e updateServerOfStatus(Status_e status);
    Status_e turnOn();
    Status_e turnOff();
private:

    int m_heaterControlPin;
    String m_serverUrl;
    Status_e m_heaterStatus;
};
