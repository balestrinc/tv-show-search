import React from "react";
import { mount } from "enzyme";
import { act } from 'react-dom/test-utils';

import TvSearch from "./TvSearch";
import SearchFailure from "./SearchFailure/SearchFailure";
import PhraseInput from "./PhraseInput/PhraseInput";
import Loading from "./Loading/Loading";

describe("<TvSearch>", () => {

  it("render <PhraseInput> component by default", async () => {
    const fetchTvShowsPromise = Promise;
    const TvShowService = { fetchTvShows: () => fetchTvShowsPromise };

    const tree = mount(
      <TvSearch TvShowService={TvShowService} />
    );

    expect(tree.find(PhraseInput)).toExist();
    expect(tree.find(SearchFailure)).not.toExist();
    fetchTvShowsPromise.resolve({});
  });

  it("render <PhraseInput> component even if search failed", async () => {
    const TvShowService = { fetchTvShows: () => Promise.reject() };

    const tree = mount(
      <TvSearch TvShowService={TvShowService} />
    );

    expect(tree.find(PhraseInput)).toExist();
  });

  it("render <SearchFailure> if search failed", async () => {
    const waitForAsync = () => new Promise(resolve => setImmediate(resolve))

    const TvShowService = { fetchTvShows: () => Promise.reject() };

    const tree = mount(
      <TvSearch TvShowService={TvShowService} />
    );

    tree.find("#buttonSearch").simulate("click");

    await act(async () => {
      await waitForAsync();
      tree.update();
    });
    expect(tree.find(SearchFailure)).toExist();
  });


  it("render <Loading> when search triggered", async () => {
    const waitForAsync = () => new Promise(resolve => setImmediate(resolve))

    const TvShowService = { fetchTvShows: () => Promise.resolve([]) };

    const tree = mount(
      <TvSearch TvShowService={TvShowService} />
    );

    tree.find("#buttonSearch").simulate("click");

    expect(tree.find(Loading)).toExist();

    // then when it is resolved
    await act(async () => {
      await waitForAsync();
      tree.update();
    });

    // hide loading
    expect(tree.find(Loading)).not.toExist();
  });


});
