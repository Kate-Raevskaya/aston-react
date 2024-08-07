import PropTypes from "prop-types"
import type React from "react"
import { useEffect, useRef, useState } from "react"
import { NavLink } from "react-router-dom"

import { dateNow } from "../../helpers/date-transform"
import { useDebounce } from "../../hooks/useDebounce"
import searchIcon from "../../icons/search.svg"
import { useGetDogsByBreedQuery } from "../../store/apiSlice"
import { addHistoryNote } from "../../store/historySlice"
import { useAppDispatch } from "../../store/hooks"
import "./SearchField.scss"

type Props = {
  onSubmit: (value: string) => void
  initialValue: string
}

export const SearchField = ({ onSubmit, initialValue }: Props) => {
  let [inputValue, setInputValue] = useState(initialValue)
  let [focus, setFocus] = useState<boolean>(false)

  let formRef = useRef<HTMLFormElement>(null)
  let debouncedValue = useDebounce(inputValue, 300)

  let { data: suggestions = [], isLoading } =
    useGetDogsByBreedQuery(debouncedValue)
  let dispatch = useAppDispatch()

  function handleSubmitInput(e: React.FormEvent) {
    e.preventDefault()
    if (inputValue === "") {
      return
    }
    setFocus(false)
    dispatch(
      addHistoryNote({
        id: crypto.randomUUID(),
        query: inputValue,
        timestamp: dateNow(),
      }),
    )
    onSubmit(inputValue)
  }

  function handleOnChangeInput(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value)
    setFocus(true)
  }

  function handleOnFocusInput(e: React.FocusEvent<HTMLInputElement>) {
    if (e.target.value !== "") {
      setFocus(true)
    }
  }

  function clickOut(e: MouseEvent) {
    if (formRef.current && !formRef.current.contains(e.target as Node)) {
      setFocus(false)
    }
  }

  useEffect(() => {
    document.addEventListener("click", clickOut)
    return () => {
      document.removeEventListener("click", clickOut)
    }
  })

  return (
    <div className="search-container">
      <form className="search-form" onSubmit={handleSubmitInput} ref={formRef}>
        <input
          type="text"
          placeholder="Search Breed"
          value={inputValue}
          onChange={handleOnChangeInput}
          onFocus={handleOnFocusInput}
        />
        <button type="submit" className="search-button">
          <img src={searchIcon} alt="search" />
        </button>
      </form>
      <div
        className={
          focus && debouncedValue !== ""
            ? "suggestions suggestions-focus"
            : "suggestions"
        }
      >
        {isLoading ? (
          <p>Searching...</p>
        ) : suggestions.length !== 0 ? (
          <div>
            <p>Found by query {debouncedValue}:</p>
            <ul>
              {suggestions.map(s => {
                return (
                  <li key={s.id}>
                    <NavLink to={`../dogs/${s.id}`}>{s.breed}</NavLink>
                  </li>
                )
              })}
            </ul>
          </div>
        ) : (
          <p>Nothing found :(</p>
        )}
      </div>
    </div>
  )
}

SearchField.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialValue: PropTypes.string.isRequired,
}
