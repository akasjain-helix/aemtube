import {
  a, p, div, h1, img,
} from '../../scripts/dom-helpers.js';
import {fetchBlogArticleIndex, loadTemplate} from '../../scripts/scripts.js';
import {buildBlock, createOptimizedPicture, decorateBlock, loadBlock} from "../../scripts/aem.js";

export default async function decorate(doc) {

  const index = await fetchBlogArticleIndex();
  const article = index.data.filter((item) => item.path === doc.location.pathname)[0]
  if (article.length === 0) {
    console.error('No matching document found ', doc.location.pathname);
    return doc;
  }

  const mainDiv = div({class: 'section article-header-container'},
      div({class: 'article-header-wrapper'},
        div({class: 'article-header block'},
          div({class: 'article-category'}, p(article.topic)),
          div({class: 'article-title'}, h1(article.title)),
          div({class: 'article-byline'},
            div({class: 'article-byline-info'},
              a({class: 'article-author'}, article.author),
              p({class: 'article-date'}, article.created),
            ),
          ),
          div({class: 'article-feature-video'}),
        )
      )
    );

  // article.videoUrl
  // article.thumbnail
  //const video = await loadBlock('article-video', {videoUrl: article.videoUrl})


  const video = div(
    a({href: article.videoUrl}),
    createOptimizedPicture(article.thumbnail, article.title, false, [{width: '750'}])
  );
  const videoBlock = buildBlock('video', video);
  const parentDiv = div(
    videoBlock,
  );
  mainDiv.querySelector('.article-feature-video').appendChild(parentDiv);
  decorateBlock(videoBlock);
  await loadBlock(videoBlock);

  doc.body.querySelector('main').replaceChildren(mainDiv)
}
