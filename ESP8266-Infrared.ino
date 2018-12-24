#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266mDNS.h>
#include <IRremoteESP8266.h>
#include <IRsend.h>
#include <ir_Gree.h>
#include <DNSServer.h>
#include <WiFiUdp.h>
#include <ArduinoOTA.h>

#include "webhandler.h"

const char* sta_ssid = "********";
const char* sta_password = "********";
const char* ap_ssid = "Gree-AC;

const byte DNS_PORT = 53;
DNSServer dnsServer;

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
  dnsServer.start(DNS_PORT, "*", WiFi.softAPIP());
  Serial.println();
  Serial.print("AP IP address: ");
  Serial.println(WiFi.softAPIP());

  // Wait for connection
  for (uint8_t i = 0; i < 10; i++)
  {
    if (WiFi.status() == WL_CONNECTED) break;
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

  ArduinoOTA.onStart([]() {
    String type;
    if (ArduinoOTA.getCommand() == U_FLASH) {
      type = "sketch";
    } else { // U_SPIFFS
      type = "filesystem";
    }

    // NOTE: if updating SPIFFS this would be the place to unmount SPIFFS using SPIFFS.end()
    Serial.println("Start updating " + type);
  });
  ArduinoOTA.onEnd([]() {
    Serial.println("\nEnd");
  });
  ArduinoOTA.onProgress([](unsigned int progress, unsigned int total) {
    Serial.printf("Progress: %u%%\r", (progress / (total / 100)));
  });
  ArduinoOTA.onError([](ota_error_t error) {
    Serial.printf("Error[%u]: ", error);
    if (error == OTA_AUTH_ERROR) {
      Serial.println("Auth Failed");
    } else if (error == OTA_BEGIN_ERROR) {
      Serial.println("Begin Failed");
    } else if (error == OTA_CONNECT_ERROR) {
      Serial.println("Connect Failed");
    } else if (error == OTA_RECEIVE_ERROR) {
      Serial.println("Receive Failed");
    } else if (error == OTA_END_ERROR) {
      Serial.println("End Failed");
    }
  });
  ArduinoOTA.begin();

}

void loop(void) {
  dnsServer.processNextRequest();
  server.handleClient();
  ArduinoOTA.handle();
}
