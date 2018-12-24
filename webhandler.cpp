#include "webhandler.h"

extern ESP8266WebServer server;
extern IRGreeAC irsend;

//format bytes
String formatBytes(size_t bytes) {
  if (bytes < 1024) {
    return String(bytes) + "B";
  } else if (bytes < (1024 * 1024)) {
    return String(bytes / 1024.0) + "KB";
  } else if (bytes < (1024 * 1024 * 1024)) {
    return String(bytes / 1024.0 / 1024.0) + "MB";
  } else {
    return String(bytes / 1024.0 / 1024.0 / 1024.0) + "GB";
  }
}

String getContentType(String filename) {
  if (server.hasArg("download")) {
    return "application/octet-stream";
  } else if (filename.endsWith(".htm")) {
    return "text/html";
  } else if (filename.endsWith(".html")) {
    return "text/html";
  } else if (filename.endsWith(".css")) {
    return "text/css";
  } else if (filename.endsWith(".js")) {
    return "application/javascript";
  } else if (filename.endsWith(".png")) {
    return "image/png";
  } else if (filename.endsWith(".gif")) {
    return "image/gif";
  } else if (filename.endsWith(".jpg")) {
    return "image/jpeg";
  } else if (filename.endsWith(".ico")) {
    return "image/x-icon";
  } else if (filename.endsWith(".xml")) {
    return "text/xml";
  } else if (filename.endsWith(".pdf")) {
    return "application/x-pdf";
  } else if (filename.endsWith(".zip")) {
    return "application/x-zip";
  } else if (filename.endsWith(".gz")) {
    return "application/x-gzip";
  }
  return "text/plain";
}

bool handleFileRead(String path) {
  Serial.println("handleFileRead: " + path);
  if (path.endsWith("/")) {
    path += "index.html";
  }
  String contentType = getContentType(path);
  String pathWithGz = path + ".gz";
  if (SPIFFS.exists(pathWithGz) || SPIFFS.exists(path)) {
    if (SPIFFS.exists(pathWithGz)) {
      path += ".gz";
    }
    File file = SPIFFS.open(path, "r");
    server.streamFile(file, contentType);
    file.close();
    return true;
  }
  return false;
}

void handleRoot() {
  if (!handleFileRead("/index.html")) {
    server.send(404, "text/plain", "FileNotFound");
  }
}

void handleIr() {
  for (uint8_t i = 0; i < server.args(); i++)
  {
    if (server.argName(i) == "power") // 1 0
    {
      if (atoi(server.arg(i).c_str()))
      {
        irsend.setPower(true);
      }
      else
      {
        irsend.setPower(false);
      }
    }

    if (server.argName(i) == "temp") // 16-30
    {
      irsend.setTemp(atoi(server.arg(i).c_str()));
    }

    if (server.argName(i) == "fan") // speed 0 1 2 3
    {
      irsend.setFan(atoi(server.arg(i).c_str()));
    }

    if (server.argName(i) == "mode") // 0 Auto, 1 Cool, 2 Dry, 3 Fan, 4 Heat
    {
      irsend.setMode(atoi(server.arg(i).c_str()));
    }

    if (server.argName(i) == "swing")
    {
      switch (atoi(server.arg(i).c_str()))
      {
        case 0:
          irsend.setSwingVertical(false, GREE_SWING_AUTO);
          break;
        case 1:
          irsend.setSwingVertical(false, GREE_SWING_UP);
          break;
        case 2:
          irsend.setSwingVertical(false, GREE_SWING_MIDDLE);
          break;
        case 3:
          irsend.setSwingVertical(false, GREE_SWING_DOWN);
          break;
        default:
          irsend.setSwingVertical(true, GREE_SWING_AUTO);
          break;
      }
    }
  }
  Serial.println(irsend.toString());
  irsend.send();
  handleRoot();
}

void handleNotFound() {
  if (!handleFileRead(server.uri())) {
    server.send(404, "text/plain", "FileNotFound");
  }
}
