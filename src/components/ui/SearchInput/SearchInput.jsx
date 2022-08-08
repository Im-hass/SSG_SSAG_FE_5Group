import React from 'react';
import { useRecoilState } from 'recoil';
import { isOpenState } from '../../../recoil/isOpenState';
import './SearchInput.scss';

function SearchInput() {
  const [isOpen, setIsOpen] = useRecoilState(isOpenState);

  const handleOpenSearch = (action) =>
    action === 'open' ? setIsOpen(true) : setIsOpen(false);

  return (
    <div className="header-util">
      <div className="search-box">
        {isOpen && (
          <form className="search-form">
            <input
              className="open-search-input"
              name="search-input"
              type="text"
              placeholder="검색어를 입력하세요."
            />
            <button className="search-btn" type="submit">
              <i className="search-icon" />
            </button>
          </form>
        )}

        {!isOpen && (
          <div className="not-open-search-input-wrap">
            <div className="search-input-box">
              <input
                className="not-open-search-input"
                type="text"
                onFocus={() => handleOpenSearch('open')}
              />
              <button className="search-btn" type="button">
                <i className="search-icon" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchInput;
