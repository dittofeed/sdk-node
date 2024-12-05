import { DittofeedSdk } from "./index";
import {
  InitParamsDataBase,
  IdentifyData,
  TrackData,
  PageData,
  ScreenData,
} from "@dittofeed/sdk-js-base";
import fetch from "cross-fetch";

jest.mock("cross-fetch", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockedFetch = fetch as jest.Mock;

describe("DittofeedSdk", () => {
  const initParams: InitParamsDataBase = {
    writeKey: "test-write-key",
  };

  beforeEach(() => {
    DittofeedSdk["instance"] = null;
    const { Response } = jest.requireActual("cross-fetch");

    mockedFetch.mockImplementation(() =>
      Promise.resolve(
        new Response("", {
          status: 200,
        })
      )
    );
  });

  it("should initialize the SDK and call identify", async () => {
    await DittofeedSdk.init(initParams);

    const identifyParams: IdentifyData = {
      userId: "123",
      traits: {
        email: "john@example.com",
        firstName: "John",
      },
    };

    DittofeedSdk.identify(identifyParams);
    await DittofeedSdk.flush();

    expect(fetch).toHaveBeenCalledWith(
      "https://dittofeed.com/api/public/apps/batch",
      expect.objectContaining({
        method: "POST",
        headers: {
          authorization: "test-write-key",
          "Content-Type": "application/json",
        },
        body: expect.any(String),
      })
    );
  });

  it("should initialize a new instance of the SDK and call track", async () => {
    const sdkInstance = await DittofeedSdk.initNew(initParams);

    const trackParams: TrackData = {
      userId: "123",
      event: "Made Purchase",
      properties: {
        itemId: "abc",
      },
    };

    sdkInstance.track(trackParams);
    await sdkInstance.flush();

    expect(fetch).toHaveBeenCalledWith(
      "https://dittofeed.com/api/public/apps/batch",
      expect.objectContaining({
        method: "POST",
        headers: {
          authorization: "test-write-key",
          "Content-Type": "application/json",
        },
        body: expect.any(String),
      })
    );
  });

  it("should initialize the SDK and call page", async () => {
    await DittofeedSdk.init(initParams);

    const pageParams: PageData = {
      userId: "123",
      name: "HomePage",
      properties: {
        title: "Home",
      },
    };

    DittofeedSdk.page(pageParams);
    await DittofeedSdk.flush();

    expect(fetch).toHaveBeenCalledWith(
      "https://dittofeed.com/api/public/apps/batch",
      expect.objectContaining({
        method: "POST",
        headers: {
          authorization: "test-write-key",
          "Content-Type": "application/json",
        },
        body: expect.any(String),
      })
    );
  });

  it("should initialize a new instance of the SDK and call screen", async () => {
    const sdkInstance = await DittofeedSdk.initNew(initParams);

    const screenParams: ScreenData = {
      userId: "123",
      name: "Recipe Screen",
      properties: {
        recipeType: "Soup",
      },
    };

    sdkInstance.screen(screenParams);
    await sdkInstance.flush();

    expect(fetch).toHaveBeenCalledWith(
      "https://dittofeed.com/api/public/apps/batch",
      expect.objectContaining({
        method: "POST",
        headers: {
          authorization: "test-write-key",
          "Content-Type": "application/json",
        },
        body: expect.any(String),
      })
    );
  });
});
