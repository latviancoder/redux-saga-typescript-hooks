import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { sortBy } from 'lodash';
import { createSelector } from 'reselect' ;

import { fetchRepoDetails, fetchRepos } from './actions';
import { AsyncModel, Repo, RepoDetails, RootState } from './interfaces';

const INITIAL_STATE: RootState = {
  repos: {
    isFetching: true
  }
};

export const rootReducer = reducerWithInitialState(INITIAL_STATE)
  .case(fetchRepos.started, (state) => {
    return {
      ...state,
      repos: {
        ...state.repos,
        isFetching: true
      }
    };
  })
  .case(fetchRepos.done, (state, { result }: any) => {
    return {
      ...state,
      repos: {
        payload: result,
        isFetching: false
      }
    };
  })
  .case(fetchRepoDetails.started, (state) => {
    return {
      ...state,
      repoDetails: {
        ...state.repoDetails,
        isFetching: true
      }
    }
  })
  .case(fetchRepoDetails.done, (state, payload) => {
    const { details, contributors } = payload.result;

    return {
      ...state,
      repoDetails: {
        ...state.repoDetails,
        isFetching: false,
        payload: {
          details,
          contributors
        }
      }
    }
  });

function getReposSelector(state: RootState): AsyncModel<Array<Repo>> | undefined {
  return state.repos;
}

export const getReposArraySelector = createSelector(
  getReposSelector,
  repos => repos && repos.payload && sortBy(repos.payload, e => -e.watchers_count)
);

export const getReposIsFetching = createSelector(
  getReposSelector,
  repos => repos && repos.isFetching
);

function getRepoDetailsObject(state: RootState): AsyncModel<RepoDetails> | undefined {
  return state.repoDetails;
}