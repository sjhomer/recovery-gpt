import {ShareBlockStandard, ShareButtonCircle, ShareButtonIconOnly, ShareButtonOutline} from "react-custom-share"
import {FacebookIcon, LinkedinIcon, LucideMail, TwitterIcon} from "lucide-react"

interface ShareButtonsProps {
  as?: "outline" | "circle" | "icon"
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({as = ShareBlockStandard}) => {
  const shareBlockProps = {
    url: "https://recovery-gpt.vercel.app/",
    button: ShareButtonCircle,
    buttons: [
      {network: "Linkedin", icon: LinkedinIcon},
      {network: "Twitter", icon: TwitterIcon},
      {network: "Facebook", icon: FacebookIcon},
      {network: "Email", icon: LucideMail},
    ],
    text: "RecoveryGPT - Revive your ChatGPT conversations with elegance and full privacy!",
    longtext: "Tired of the lacking user-friendly approach of default ChatGPT exports? RecoveryGPT empowers you to privately access your past conversations and review them seamlessly in a ChatGPT inspired UI.",
  }

  switch (as) {
    case "outline":
      shareBlockProps.button = ShareButtonOutline
      break;
    case "icon":
      shareBlockProps.button = ShareButtonIconOnly
      break;
  }

  return <ShareBlockStandard {...shareBlockProps}/>
}
