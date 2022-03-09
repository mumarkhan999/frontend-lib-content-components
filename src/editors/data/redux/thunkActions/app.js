import { StrictDict } from '../../../utils';
import * as mockData from '../../constants/mockData';
import { actions } from '..';
import * as requests from './requests';
import * as module from './app';

export const fetchBlock = () => (dispatch) => {
  dispatch(requests.fetchBlock({
    onSuccess: (response) => dispatch(actions.app.setBlockValue(response)),
    onFailure: (e) => dispatch(actions.app.setBlockValue(e)),
  }));
};

export const fetchUnit = () => (dispatch) => {
  dispatch(requests.fetchUnit({
    onSuccess: (response) => dispatch(actions.app.setUnitUrl(response)),
    onFailure: (e) => dispatch(actions.app.setUnitUrl(e)),
  }));
};

/**
 * @param {string} studioEndpointUrl
 * @param {string} blockId
 * @param {string} courseId
 * @param {string} blockType
 */
export const initialize = (data) => (dispatch) => {
  dispatch(actions.app.initialize(data));
  dispatch(module.fetchBlock());
  dispatch(module.fetchUnit());
};

/**
 * @param {func} onSuccess
 */
export const saveBlock = ({ content, returnToUnit }) => (dispatch) => {
  dispatch(actions.app.setBlockContent(content));
  dispatch(requests.saveBlock({
    content,
    onSuccess: (response) => {
      dispatch(actions.app.setSaveResponse(response));
      returnToUnit();
    },
  }));
};

export const fetchImages = ({ onSuccess }) => () => {
  // get images
  const processedData = Array.from(mockData.mockImageData, el => {
    const sortDate = new Date(el.dateAdded.replace(" at", "")).getTime();
    return {
      ...el,
      sortDate: sortDate,
    }
  });
  return onSuccess(processedData);
};

export default StrictDict({
  fetchBlock,
  fetchUnit,
  initialize,
  saveBlock,
  fetchImages,
});
