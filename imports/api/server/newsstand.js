import { Meteor } from 'meteor/meteor';
import FeedParser from 'feedparser';
import request from 'request';
import querystring from 'query-string';
import striptags from 'striptags';
import { Feeds } from '/imports/api/feeds/feeds';

const feeds = [{
  id: 'healthy-living',
  url: 'https://news.google.com/news?q=Tips%20on%20Healthy%20Living&output=rss'
}];

export const updateNewsStand = () => {
  feeds.map(f => {
    const req = request(f.url);
    const feedParser = new FeedParser();
    req.on('error', (error) => {
      console.log('Error getting newsstand feed data', error);
    })

    req.on('response', (res) => {
      if (res.statusCode !== 200) {
        console.log('Bad newsstand response code');
      } else {
        req.pipe(feedParser);
      }
    });

    feedParser.on('readable', Meteor.bindEnvironment(() => {
      let item;
      while (item = feedParser.read()) {
        const parsedLink = querystring.parse(item.link);

        Feeds.upsert({
          source: 'newsstand',
          group: f.id,
          title: item.title,
          link: parsedLink.url
        }, {
          $set: {
            source: 'newsstand',
            group: f.id,
            title: item.title,
            createdAt: item.date,
            description: striptags(item.description),
            link: parsedLink.url
          }
        });
      }
    }));
  });
};
