import { DogCard } from "../../components/DogCard/DogCard"
import { useGetDogByIdQuery } from "../../store/apiSlice"
import { useAppSelector } from "../../store/hooks"
import { getFavorites } from "../../store/selectors"
import "./FavoritesPage.scss"

const Dog = ({ id }: { id: number }) => {
  let { data: dog } = useGetDogByIdQuery(id)
  return (
    <div>
      {dog ? (
        <DogCard
          key={dog.id}
          id={dog.id}
          url={`https://cdn2.thedogapi.com/images/${dog.reference_image_id}.jpg`}
          breed={dog.name}
        />
      ) : null}
    </div>
  )
}

export const FavoritesPage = () => {
  let dogsId = useAppSelector(getFavorites)

  return (
    <div className="favorites">
      <h2 className="favorites-header">Favorites</h2>
      <div className="favorites-container">
        {dogsId.length === 0 ? (
          <p>You don't have favorites yet</p>
        ) : (
          dogsId.map(id => {
            return <Dog key={id} id={id} />
          })
        )}
      </div>
    </div>
  )
}

export default FavoritesPage
