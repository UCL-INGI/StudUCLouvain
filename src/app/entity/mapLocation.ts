export class MapLocation{
  public title: string;
  public code: string;
  public address: string;
  public lat : string;
  public lng : string;

  constructor(title: string, address: string, lat: string, lng: string, code: string) {
    this.title = title;
    this.address = address;
    this.lat = lat;
    this.lng = lng;
    this.code = code;
  }
}
