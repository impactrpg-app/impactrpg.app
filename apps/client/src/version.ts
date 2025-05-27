import { API_URL } from "./service/api";
import PackageJson from "../package.json";

fetch(`${API_URL}/version`, {
  method: "GET",
}).then((req) => {
  req.json().then((data) => {
    const { version } = data;
    if (PackageJson.version !== version) {
      console.log(`version mismatch: ${PackageJson.version} !== ${version}`);
      location.reload();
    }
  });
});
