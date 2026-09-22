import { useEffect, useState } from 'react'
import { getFeatures, type Features } from '../api/features'

// Valeur de repli si l'appel echoue. Volontairement restrictive : mieux vaut
// une interface amputee qu'un bouton qui declenche une action que le backend
// refusera de toute facon.
const REPLI: Features = { ecritureActivee: false }

export function useFeatures(): Features {
  const [features, setFeatures] = useState<Features>(REPLI)

  useEffect(() => {
    let cancelled = false
    getFeatures()
      .then((result) => {
        if (!cancelled) setFeatures(result)
      })
      .catch(() => {
        if (!cancelled) setFeatures(REPLI)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return features
}
