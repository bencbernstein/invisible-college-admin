const IMAGE_URL = "http://localhost:3002/image"

const query = (url: string): any | Error =>
  fetch(url, {
    headers: { "Content-Type": "application/json" },
    method: "GET"
  }).then(res => res.json())

const addImageQuery = (form: FormData, wordId: string): any | Error =>
  fetch(IMAGE_URL + "?action=POST&id=" + wordId, {
    body: form,
    method: "POST"
  }).then(res => res.json())

export const addImage = async (
  file: File,
  wordId: string
): Promise<any | Error> => {
  const form = new FormData()
  form.append("file", file)
  return addImageQuery(form, wordId)
}

export const removeImage = async (
  wordId: string,
  imageId: string
): Promise<any | Error> => {
  const ids = wordId + "," + imageId
  const url = IMAGE_URL + `?action=DELETE&ids=${ids}`
  return query(url)
}

export const fetchImages = async (ids: string[]): Promise<any | Error> => {
  const url = IMAGE_URL + `?action=GET&ids=${ids.join(",")}`
  return query(url)
}
