import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { ActionRow, Button, Dropdown, Image, Stack, Scrollable, SearchField, SelectableBox } from '@edx/paragon';

import { thunkActions } from '../../../data/redux';
import BaseModal from './BaseModal';
import * as module from './SelectImageModal';

export const hooks = {
  imageList: ({ fetchImages }) => {
    const [images, setImages] = React.useState([]);
    React.useEffect(() => {
      fetchImages({ onSuccess: setImages });
    }, []);
    return images;
  },
  onSelectClick: ({ setSelection, images, selectedImg }) => () => {
    setSelection(images.find(img => img.id === selectedImg));
  },
};

export const SelectImageModal = ({
  fetchImages,
  isOpen,
  close,
  setSelection,
}) => {
  const images = module.hooks.imageList({ fetchImages });
  const [selectedImg, setSelectedImg] = React.useState("");
  const onSelectClick = module.hooks.onSelectClick({
    setSelection,
    images,
    selectedImg,
  });

  const [searchString, setSearchString] = React.useState("");
  const [sort, setSort] = React.useState(0);

  const searchResult = images.filter(img => 
    img.displayName.toLowerCase().includes(searchString)
  );
  switch ( sort ) {
    case 0:
      searchResult.sort(sortDateNewest);
      break;
    case 1:
      searchResult.sort(sortDateOldest);
      break;
    case 2:
      searchResult.sort(sortNameAscending);
      break;
    case 3:
      searchResult.sort(sortNameDescending);
      break;
  }

  const handleSelectImgChange = (e) => {
    e.target.value === selectedImg
      ? setSelectedImg("")
      : setSelectedImg(e.target.value);
  };
  
  return (
    <BaseModal
      isOpen={isOpen}
      close={close}
      title="Add an image"
      confirmAction={<Button variant="primary" onClick={onSelectClick}>Next</Button>}
    >
      <Stack gap={3}>

        {/* Search Filtering */}
        <ActionRow>
          <SearchField onSubmit={v => setSearchString(v)} />
          <ActionRow.Spacer/>
          <Dropdown>
            <Dropdown.Toggle id="img-sort-button">
              {SORT_OPTIONS[sort]}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {SORT_OPTIONS.map(
                (el, ind) => (
                  <Dropdown.Item onClick={() => setSort(ind)}>{el}</Dropdown.Item>
                )
              )}
            </Dropdown.Menu>
          </Dropdown>
        </ActionRow>

        {/* Content Selection */}
        <Scrollable style={{height: '50vh', padding: '3%'}}>
          <SelectableBox.Set
            columns={1}
            name='images'
            onChange={handleSelectImgChange}
            type='radio'
            value={selectedImg}
          >
            {searchResult.map(
              img => (
                <SelectableBox value={img.id} type='radio'>
                  <div key={img.externalUrl} style={{display: 'flex', flexFlow: 'row nowrap'}}>
                    <Image style={{ width: '100px', height: '100px' }} src={img.externalUrl} />
                    <div>
                      <h3>{img.displayName}</h3>
                      <p>{img.dateAdded}</p>
                    </div>
                  </div>
                </SelectableBox>
              )
            )}
          </SelectableBox.Set>
        </Scrollable>

      </Stack>
      {/* upload img button in BaseModal */}
    </BaseModal>
  );
};

const SORT_OPTIONS = [
  "By date added (newest)",
  "By date added (oldest)",
  "By name (ascending)",
  "By name (descending)",
];

export const sortDateNewest = (a, b) => {
  return b.sortDate - a.sortDate;
};

export const sortDateOldest = (a, b) => {
  return a.sortDate - b.sortDate;
};

export const sortNameAscending = (a, b) => {
  const nameA = a.displayName.toLowerCase();
  const nameB = b.displayName.toLowerCase();
  if (nameA < nameB) return -1;
  if (nameB < nameA) return 1;
  return b.sortDate - a.sortDate;
};

export const sortNameDescending = (a, b) => {
  const nameA = a.displayName.toLowerCase();
  const nameB = b.displayName.toLowerCase();
  if (nameA < nameB) return 1;
  if (nameB < nameA) return -1;
  return b.sortDate - a.sortDate;
};

SelectImageModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  setSelection: PropTypes.func.isRequired,
  // redux
  fetchImages: PropTypes.func.isRequired,
};

export const mapStateToProps = () => ({});
export const mapDispatchToProps = {
  fetchImages: thunkActions.app.fetchImages,
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectImageModal);
