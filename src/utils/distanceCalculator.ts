function distanceInMeters(lat1:number, lon1:number, lat2:number, lon2:number) {
    const R = 6371e3; // radius of the earth in meters
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // distance in meters
    return d;
  }
  
  function toRad(value:number) : number {
    return value * Math.PI / 180;
  }

  export{distanceInMeters, toRad}