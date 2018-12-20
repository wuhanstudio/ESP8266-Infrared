#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266mDNS.h>
#include <IRremoteESP8266.h>
#include <IRsend.h>
#include <ir_Gree.h>

#include "webhandler.h"

const char* sta_ssid = "Wuhan-Studio";
const char* sta_password = "23218114";
const char* ap_ssid = "Room-114-Gree";

MDNSResponder mdns;
ESP8266WebServer server(80);

#define IR_PIN 3
IRGreeAC irsend(IR_PIN);

void setup(void) {
  SPIFFS.begin();
  irsend.begin();
  Serial.begin(115200, SERIAL_8N1, SERIAL_TX_ONLY);

  WiFi.begin(sta_ssid, sta_password);
  WiFi.softAP(ap_ssid);

  Serial.print("AP IP address: ");
  Serial.println(WiFi.softAPIP());

  // Wait for connection
  for (uint8_t i = 0; i < 10; i++)
  {
    if (WiFi.status() != WL_CONNECTED) break;
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  if (WiFi.status() == WL_CONNECTED)
  {
    Serial.print("Connected to ");
    Serial.println(sta_ssid);
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP().toString());
  }

  if (mdns.begin("esp8266", WiFi.localIP())) {
    Serial.println("MDNS responder started");
  }

  server.on("/", handleRoot);
  server.on("/ir", handleIr);
  server.onNotFound(handleNotFound);

  server.begin();
  Serial.println("HTTP server started");

}

void loop(void) {
  server.handleClient();
}
