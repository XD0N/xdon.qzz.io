import { Github, Linkedin, Mail } from "lucide-react";
import SocialMediaLink from "./SocialMediaLink";

function Socials() {
  return (
    <div className="flex gap-6 ">
      {/*<SocialMediaLink link="https://github.com/XD0N">
        <Linkedin />
      </SocialMediaLink>*/}
      <SocialMediaLink link="https://github.com/XD0N">
        <Github />
      </SocialMediaLink>
      <SocialMediaLink link="mailto:xdon_y@163.com">
        <Mail />
      </SocialMediaLink>
    </div>
  );
}

export default Socials;
