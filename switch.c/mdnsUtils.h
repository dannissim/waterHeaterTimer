#pragma once
#include <WString.h>

namespace mdns{
  void start_mdns_service();
  String resolve_mdns_host(String host_name);
}
