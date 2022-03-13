import Ajv from "ajv";
import addFormats from "ajv-formats";
import ajvErrors from "ajv-errors";
import ajvKeywords from "ajv-keywords";

const ajv = new Ajv({
    allErrors: true,
    $data: true,
    useDefaults: "empty",
  });
  
  ajvErrors(ajv);
  addFormats(ajv);
  ajvKeywords(ajv, ["transform"]);
  ajv.addFormat("phone", /(84|0[3|5|7|8|9])+([0-9]{8})$/);
  // ajv.addFormat("special", /^[^<>{}\"/|;:.,~!?@#$%^=&*\\]\\\\()\\[¿§«»ω⊙¤°℃℉€¥£¢¡®©0-9_+]*$/;);
  ajv.addFormat("alphabet", /^[a-zA-Z0-9]*$/);
  ajv.addFormat("alphabetSplace", /^[a-zA-Z0-9_ ]*$/);

  export default ajv;