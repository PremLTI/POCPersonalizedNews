import {
  
  BaseImageCardView,
  IImageCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
// import * as strings from 'PgNewsCarouselOnMenuAdaptiveCardExtensionStrings';
import { IPgNewsCarouselOnMenuAdaptiveCardExtensionProps, IPgNewsCarouselOnMenuAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../PgNewsCarouselOnMenuAdaptiveCardExtension';

export class CardView extends BaseImageCardView<IPgNewsCarouselOnMenuAdaptiveCardExtensionProps, IPgNewsCarouselOnMenuAdaptiveCardExtensionState> {
  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    return [
      {
        title: "See More News",
        action: {
          type: 'QuickView',
          parameters: {
            view: QUICK_VIEW_REGISTRY_ID
          }
        }
      }
    ];
  }
// Card View Display properties 
  public get data(): IImageCardParameters {
    return {
      primaryText: this.state.PGnewsCarousel ? this.state.PGnewsCarousel[0].title +": "+ this.state.PGnewsCarousel[0].newsDescription.substring(0, 140) + '...' : `Title or Description Missed`,
      imageUrl: this.state.PGnewsCarousel[0].pgCarouselImage ? this.state.PGnewsCarousel[0].pgCarouselImage : require('../assets/MicrosoftLogo.png'),
      title: "PG Daily News"
    
    };
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return {
      type: 'QuickView',
      parameters: {
    view: QUICK_VIEW_REGISTRY_ID
      }
    };
  }
}
