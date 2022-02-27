import { useForm } from 'react-hook-form'

export function Name({db}){
  function updateName(data){
    console.log(data);
    if(data.name){
      // remove special chars
      let cleanName = data.name.replace(/[!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]/ig,'').substring(0,20);
      console.log(`Clean name: ${cleanName}`);
      // 20 chars max
      name = cleanName;
      db.setName(cleanName);
    }
  }

  let name = db?.getUserProfile()?.name

  console.log(`Rendering settings with db=${db}, name=${name}`);

  const {register, handleSubmit, setValue, formState: { errors }} = useForm({
    mode: 'onChange',
    // defaultValues: {name: name}
  });

  //this is the worlds ugliest hack, i hate this whole framework so much
  if(name && !errors.name){
    setValue('name', name);
  }

  if(errors.name){
    console.log(errors);
  }


  return (
    <form className="w-full mt-8"
      onBlur={handleSubmit(updateName)}
      onSubmit={handleSubmit(updateName)}
    >
      <div className="flex items-center">
        <div className="w-1/3">
          <label className="block text-right mb-1 mb-0 pr-4" htmlFor="inline-full-name">
            Name
          </label>
        </div>
        <div className="w-2/3">
          <input className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            type="text"
            {...register('name', {value: name, maxLength:20, pattern:/^[\w]+$/})}
            id="name"
            aria-label="Name"
            placeholder="Name"
          />
        </div>
      </div>
      <div className="flex items-center">
        <div className="w-1/3">
        </div>

        <div className="w-2/3 text-left text-red-500">
          {errors.name?.type === 'pattern' && 'Invalid characters...'}
          {errors.name?.type === 'maxLength' && 'Too long...'}
        </div>
      </div>
    </form>
  );
}
