import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
// import * as strings from 'PgNewsCarouselOnMenuAdaptiveCardExtensionStrings';
import { IPgNewsCarouselOnMenuAdaptiveCardExtensionProps, IPgNewsCarouselOnMenuAdaptiveCardExtensionState } from '../PgNewsCarouselOnMenuAdaptiveCardExtension';
import {
  CreateItemToList,
  IListItem
} from '../pgNews.service'

export interface IQuickViewData {

  pgnewsall: any[];
  pgGlobalNews: any[];
  pgLocalNews: any[];
}

export class QuickView extends BaseAdaptiveCardView<
  IPgNewsCarouselOnMenuAdaptiveCardExtensionProps,
  IPgNewsCarouselOnMenuAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {

    // passing the collection into quickview json.
    return {
      pgnewsall: this.state.PGnewsCarousel,
      pgGlobalNews: this.state.PGnewsCarouselFirstIndexView,
      pgLocalNews: this.state.PGnewsCarouselRestAllIndexView
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }

  public async onAction(action: IActionArguments): Promise<void> {


    if (action.type !== 'Submit') { return; }

    let currentIndex = this.state.currentIndex;
    this.setState({ currentIndex: currentIndex + Number(action.id) });

    if (action.type == 'Submit') {

      // with secound index array, checking the request raised if site page, ID and List item PageID should be matched. if matched, changing isRequested property to 'true'.
      this.state.PGnewsCarouselRestAllIndexView.forEach((item: IListItem, index: number) => {
        if (item.pgLocation == "Local" && item.id == action.data.id.toString()) {

          item.isRequested = true;

        }
      });

      // with first index array, checking the request raised if site page , ID and List item PageID should be matched. if matched, changing isRequested property to 'true'.
      this.state.PGnewsCarouselFirstIndexView.forEach((item: IListItem, index: number) => {
        if (item.pgLocation == "Local" && item.id == action.data.id.toString()) {

          item.isRequested = true;

        }
      });
      try {
        // based on promote to global request, creating items in backend list. 
        await CreateItemToList(this.context, action.data);
      }
      catch (error) { console.log("Error in onAction method : " + error); }
    }
  }
}