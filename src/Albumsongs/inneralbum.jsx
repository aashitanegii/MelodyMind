import React, { useEffect, useState } from "react";
import useMediaQuery from "../useMedia";
import { useContext } from "react";
import { Context } from "../context.js"; // Updated import
import { addRecents } from "../Firebase/database";
import he from "he";
import { albumsongsinner } from "../saavnapi";
function Inneralbum({ names }) {
  const isAboveMedium = useMediaQuery("(min-width:768px)");
  const { setSongid, innerAlbum } = useContext(Context);
  const [image, setimage] = useState([]);

  const [musicInfo, setMusicInfo] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await albumsongsinner(innerAlbum);
        setimage(res.data.data);

        setMusicInfo(
          res.data.data.songs.map((song) => ({
            id: song.id,
            name: he.decode(song.name),
            image: song.image[2] ? song.image[2] : song.image[1],
            artist: song.artists.primary[0].name,
            year: song.year,
          }))
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [names]);

  const play = async (id, name, image) => {
    localStorage.setItem("songid", id);
    setSongid(id);
    const user = JSON.parse(localStorage.getItem("Users"));

    if (user) {
      try {
        await addRecents(user.uid, id, name, image);
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <>
      {!loading ? (
        <>
          {isAboveMedium ? (            <div              className="h-screen w-5/6 m-12  mb-28 flex flex-col bg-gradient-album border-1 border-deep-grey shadow-lg overflow-y no-scrollbar"
            >
              <div className="w-full h-2/6 bg-white flex bg-gradient-album p-4 border-y-1 border-deep-grey shadow-2xl">
                <img src={image.image[1].url} />
                <h1 className="font-bold text-3xl p-5">
                  {image.name}{" "}
                  <span className="text-red">{image.language}</span>
                </h1>
              </div>
              {musicInfo.slice(0, musicInfo.length).map((song, index) => (
                <div
                  className="w-5/6 bg-deep-grey flex items-center gap-8 p-4 m-5 cursor-pointer"
                  key={song.id}
                  onClick={() => play(song.id, song.name, song.image.url)}
                >
                  <h1 className="text-2xl w-12">#{index + 1}</h1>{" "}
                  {/* Fixed width for index */}
                  <img src={song.image.url} className="h-12" />{" "}
                  {/* Keep image size fixed */}
                  <h1 className="text-md flex-grow">{song.year}</h1>{" "}
                  {/* Allow year to take remaining space */}
                  <h1 className="text-md flex-grow">{song.name}</h1>
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/9376/9376391.png"
                    className="h-12"
                  />{" "}
                  {/* Keep image size fixed */}
                </div>
              ))}
              <div className="flex  mb-8"></div>
            </div>
          ) : (            <div              className="h-screen w-full mb-24 flex flex-col bg-gradient-album border-1 border-deep-grey shadow-lg overflow-y no-scrollbar"
            >
              <div className="w-full h-2/6 bg-white flex bg-gradient-album p-4 border-y-1 border-deep-grey shadow-2xl">
                <img src={image.image[1].url} />
                <h1 className="font-bold text-md p-5">
                  {image.name}{" "}
                  <span className="text-red">{image.language}</span>
                </h1>
              </div>
              {musicInfo.slice(0, musicInfo.length).map((song, index) => (
                <div
                  className="w-5/6 bg-deep-grey flex items-center gap-8 p-4 m-5 cursor-pointer"
                  key={song.id}
                  onClick={() => play(song.id, song.name, song.image.url)}
                >
                  <p className="text-sm w-full">#{index + 1}</p>{" "}
                  {/* Fixed width for index */}
                  <img src={song.image.url} className="h-12" />{" "}
                  {/* Keep image size fixed */}
                  <p className="text-sm flex-grow">{song.year}</p>{" "}
                  {/* Allow year to take remaining space */}
                  <p className="text-sm flex-grow">{song.name}</p>
                  {/* Keep image size fixed */}
                </div>
              ))}
              <div className="flex  ml-8  mb-36"></div>
            </div>
          )}
        </>
      ) : (
        <span className="text-red text-3xl font-bold">Loading.....</span>
      )}
    </>
  );
}
export default Inneralbum;
