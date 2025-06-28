import { toast } from "sonner";

export const fetchIPData = async (ip: string) => {
  try {
    const response = await fetch(`https://ipwho.is/${ip}`);
    const data = await response.json();
    
    if (data.success === false) {
      return await fetchIPDataFallback(ip);
    }
    
    const formattedData: Record<string, any> = {
      "IP Address": data.ip
    };
    
    if (data.type) formattedData["Type"] = data.type;
    if (data.continent) formattedData["Continent"] = data.continent;
    if (data.country) formattedData["Country"] = data.country;
    if (data.country_code) formattedData["Country Code"] = data.country_code;
    if (data.region) formattedData["Region"] = data.region;
    if (data.city) formattedData["City"] = data.city;
    if (data.postal) formattedData["Postal Code"] = data.postal;
    if (data.latitude) formattedData["Latitude"] = data.latitude;
    if (data.longitude) formattedData["Longitude"] = data.longitude;
    
    if (data.timezone) {
      const timezone = data.timezone;
      let timezoneStr = timezone.id || '';
      if (timezone.abbr) timezoneStr += ` (${timezone.abbr})`;
      formattedData["Timezone"] = timezoneStr;
      
      if (timezone.utc) formattedData["Timezone UTC"] = timezone.utc;
    }
    
    if (data.connection) {
      const conn = data.connection;
      if (conn.isp) formattedData["ISP"] = conn.isp;
      if (conn.org) formattedData["Organization"] = conn.org;
      if (conn.asn) formattedData["ASN"] = conn.asn;
      if (conn.domain) formattedData["Domain"] = conn.domain;
    }
    
    if (data.currency) {
      const curr = data.currency;
      if (curr.name && curr.symbol) {
        formattedData["Currency"] = `${curr.name} (${curr.symbol})`;
      } else if (curr.name) {
        formattedData["Currency"] = curr.name;
      } else if (curr.symbol) {
        formattedData["Currency"] = curr.symbol;
      }
    }
    
    if (data.security) {
      if (data.security.vpn !== undefined) formattedData["VPN"] = data.security.vpn ? "Yes" : "No";
      if (data.security.proxy !== undefined) formattedData["Proxy"] = data.security.proxy ? "Yes" : "No";
      if (data.security.tor !== undefined) formattedData["Tor"] = data.security.tor ? "Yes" : "No";
      if (data.security.relay !== undefined) formattedData["Relay"] = data.security.relay ? "Yes" : "No";
      if (data.security.hosting !== undefined) formattedData["Hosting"] = data.security.hosting ? "Yes" : "No";
    }
    
    const coordinates = data.latitude && data.longitude 
      ? { lat: data.latitude, lng: data.longitude } 
      : null;
    
    return { 
      formattedData, 
      coordinates,
      error: null
    };
  } catch (err) {
    console.error("IP tracking error:", err);
    throw new Error(err instanceof Error ? err.message : "Failed to connect to IP tracking service");
  }
};

const fetchIPDataFallback = async (ip: string) => {
  try {
    const fallbackResponse = await fetch(`https://ipapi.co/${ip}/json/`);
    const fallbackData = await fallbackResponse.json();
    
    if (fallbackData.error) {
      throw new Error(fallbackData.reason || "Invalid IP address");
    }
    
    const formattedData: Record<string, any> = {
      "IP Address": fallbackData.ip || ip
    };
    
    if (fallbackData.country_name) formattedData["Country"] = fallbackData.country_name;
    if (fallbackData.country_code) formattedData["Country Code"] = fallbackData.country_code;
    if (fallbackData.region) formattedData["Region"] = fallbackData.region;
    if (fallbackData.city) formattedData["City"] = fallbackData.city;
    if (fallbackData.postal) formattedData["Postal Code"] = fallbackData.postal;
    if (fallbackData.latitude) formattedData["Latitude"] = fallbackData.latitude;
    if (fallbackData.longitude) formattedData["Longitude"] = fallbackData.longitude;
    if (fallbackData.timezone) formattedData["Timezone"] = fallbackData.timezone;
    if (fallbackData.org) formattedData["ISP"] = fallbackData.org;
    if (fallbackData.asn) formattedData["ASN"] = fallbackData.asn;
    if (fallbackData.currency_name) formattedData["Currency"] = fallbackData.currency_name;
    
    const coordinates = fallbackData.latitude && fallbackData.longitude 
      ? { lat: fallbackData.latitude, lng: fallbackData.longitude } 
      : null;
    
    return {
      formattedData,
      coordinates,
      error: null
    };
  } catch (fallbackErr) {
    throw new Error(fallbackErr instanceof Error ? fallbackErr.message : "Failed to track IP address");
  }
};

export const fetchCurrentIP = async () => {
  try {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return { ip: data.ip, error: null };
    } catch (e) {
      const fallbackResponse = await fetch("https://ipinfo.io/json");
      const fallbackData = await fallbackResponse.json();
      if (fallbackData.ip) {
        return { ip: fallbackData.ip, error: null };
      } else {
        throw new Error("Could not detect your IP");
      }
    }
  } catch (err) {
    return { 
      ip: null, 
      error: "Failed to fetch your IP address" 
    };
  }
};
