## What does Tableau Dashboard Refresher do?
Tableau Public only lets you refresh your dashboards automatically once a day. If refreshing your Tableau dashboards once a day is not enough, and a Tableau subscription is too pricey and otherwise unnecessary for you, then this free tool is exactly what you need.

Tableau Dashboard Refresher allows you to refresh your Tableau dashboards as many times a day as you want. It does it automatically, even when you are away.

## What is Tableau?
Tableau is an analytics platform that makes visualizing your data effortless. Visualizations help you understand your data better and uncover insights to improve your business.

Tableau connects to your database through a dashboard and shows you your data in a graphically appealing and easy-to-read format.

Take Google Sheets, for example. You can insert a large amount of data on multiple spreadsheets, and you might need to present it to clients or colleagues. Tableau connects to your spreadsheets and displays your data through impactful graphs and charts.

## How much will Tableau Dashboard Refresher cost to use?
Tableau Dashboard Refresher consumes 0.02 [compute units](https://help.apify.com/en/articles/3490384-what-is-a-compute-unit) for one refresh; therefore, 1,000 refreshes = 2CUs, amounting to 0.5$. 

In other words, you can refresh your dashboard every hour for a month for less than half a dollar!
  

## Input
All the actor needs are the URL for the dashboard you want to refresh and your Tableau Public account credentials. The actor will use this information to log into your Tableau Public repository, refresh the page and click `request data refresh`. 
```json
{
  "url": "https://public.tableau.com/app/profile/pablolgomez/viz/HappinessintheWorld_16245341657220/WHR",
  "email": "my.email@example.com",
  "password": "my_password_to_tableau"
}
```
