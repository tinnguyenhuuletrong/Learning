# https://github.com/gregpr07/browser-use

from langchain_openai import ChatOpenAI
from browser_use import Agent
from browser_use.browser.service import Browser
from browser_use.controller.service import Controller
from pydantic import BaseModel, SecretStr
import asyncio

controller = Controller()


class WebpageInfo(BaseModel):
	link: str = ' https://kyc.blockpass.org/kyc/dashboard/index.html#/blockpass_sales_demo/kyc_list'


@controller.action('Go to the webpage', param_model=WebpageInfo, requires_browser=True)
async def go_to_webpage(webpage_info: WebpageInfo, browser: Browser):
    page = await browser.get_current_page()
    print("Cookies updated SSID")
    await browser.session.context.add_cookies([{
         "name": 'SSID',
         "value": '[update_me]',
         "domain": ".blockpass.org",
         "path": "/"
    }])
    print("Open link")
    await page.goto(webpage_info.link)



async def main():
    agent = Agent(
        task="Go to the webpage. Use Filter tool to search the email aaa@gmail.com. it should have 1 record. Click to that record",
        llm=ChatOpenAI(model="gpt-4o-mini"),
        controller=controller
    )
    result = await agent.run()
    print(result)
    
if __name__ == "__main__":
    asyncio.run(main())