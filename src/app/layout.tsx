import "./globals.css"
import type React from "react"
import { Toaster } from "sonner"
import { CopilotKit } from "@copilotkit/react-core"; 
import "@copilotkit/react-ui/styles.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
      <CopilotKit publicApiKey="<your-copilot-cloud-public-api-key>"> 

        {children}
        <Toaster />
      </CopilotKit>
      </body>
    </html>
  )
}

