#include <esp_err.h>
#include "mdnsUtils.h"
#include "mdns.h"


namespace mdns{
void start_mdns_service()
{
    //initialize mDNS service
    esp_err_t err = mdns_init();
    if (err) {
        printf("MDNS Init failed: %d\n", err);
        return;
    }

    //set hostname
    mdns_hostname_set("water-heater");
    //set default instance
    mdns_instance_name_set("Water boiler switch");
}

String resolve_mdns_host(String host_name)
{
    printf("Query A: %s.local", host_name.c_str());

    struct ip4_addr addr;
    addr.addr = 0;

    esp_err_t err = mdns_query_a(host_name.c_str(), 2000,  &addr);
    if(err){
        if(err == ESP_ERR_NOT_FOUND){
            printf("Host was not found!");
            return "";
        }
        printf("Query Failed");
        return "";
    }
    char ipBuf[4 * 4];
    sprintf(ipBuf, IPSTR, IP2STR(&addr));
    auto foundIP = String(ipBuf);
    return foundIP;
}

}
