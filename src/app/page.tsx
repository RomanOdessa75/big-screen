import axios from "axios";
import BigScreen from "../components/BigScreen";

interface BidUser {
  _id: string;
  isAnonymous: boolean;
}

interface Bid {
  _id: string;
  createdAt: string;
  campaignUser: BidUser;
  value: number;
  count: number;
}

interface Lot {
  title: string;
  imageUrl: string;
  type: string;
  minimumBid: number;
  bids: Bid[];
}

export interface CampaignData {
  bodyBackgroundColor: string;
  headerLeftImageUrl: string;
  headerLeftImageSize: number;
  title: string;
  headerRightImageUrl: string;
  headerRightImageSize: number;
  headerFontSize: number;
  verticalLotCardFontSize: number;
  verticalLotCardTitleCharacterLimit: number;
  lotList: Lot[];
  currencyCode: string;
}

export default async function Home() {
  try {
    const { data } = await axios.get<CampaignData>(
      "http://localhost:3001/payload"
    );
    return <BigScreen initialData={data} />;
  } catch (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Failed to load data. Please check the server connection.
      </div>
    );
  }
}
