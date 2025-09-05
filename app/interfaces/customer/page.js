"use client"
import {useState, useEffect} from 'react'
import LoadingIndicator from '@/app/components/loadingIndicator/loadingIndicator'
import Select from 'react-select'
import { useForm, Controller } from 'react-hook-form'
import BackButton from '@/app/components/backButton/backButton';

export default function CustomerManagement() {
     const {
      register,
      handleSubmit,
      watch,
      control,
      reset,
      formState: { errors,isSubmitting },
    } = useForm();

    const [loading, setLoading] =useState(false);
    const [customers, setCustomers] =useState([]);
    const [ nextCustomerId, setNextCustomerId] =useState("");

    const onSubmit = async(data) =>{
        console.log(data)
    }

  return (
    <main className='p-10 flex flex-col'>
          {loading && <div className="fixed inset-0 backdrop-blur-xs z-50 flex items-center justify-center">
                        <div className="p-3 flex items-center justify-center h-[50px] text-white w-[100px] rounded-lg">
                          <LoadingIndicator />
                        </div>
                      </div>}
        <div className="flex flex-row mb-10">
               <BackButton/>
               <p className="font-bold text-3xl">Add or Edit Customers</p>
        </div>
        <div className="flex justify-center align-middle w-full">
         <form 
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-6 p-8 bg-white rounded-lg shadow-md w-4/5'>
            <div className="grid grid-cols-2 gap-4">
          <div>
              <p className="font-semibold">Customer ID (auto)</p>
              <input
                readOnly
                value={
                  watch("searchCustomer") 
                    ? watch("searchCustomer").value 
                    : nextCustomerId || ""             
                }
                className="h-[50px] border-2 border-[#F3F6F8] rounded-lg p-3 w-full bg-gray-100"
              />
            </div>
          <div>
              <p className="font-semibold">Search Customer</p>
              <Controller
                control={control}
                name="searchCustomer"
                render={({ field }) => (
                  <Select
                    {...field}
                    options={customers.map((p) => ({
                      value: p.customer_id,
                      label: p.customer_name,
                    }))}
                    placeholder="Search Customers..."
                    isSearchable
                    onChange={(opt) => {
                      field.onChange(opt);
                      if (opt) {setLoading(true);
                        fetch(`/api/salesman/addUpdateSalesman/${opt.value}`)  
                          .then((res) => res.json())
                          .then((customers) => {
                            if (customers) { 
                             reset({
                                  searchCustomer: opt,
                                  salesmanName: salesman.salesman_name,
                                  bloodGroup: bloodGroupOptions.find(bg => bg.value === salesman.salesman_bld_grp),
                                  salesmanContact: salesman.salesman_contact,
                                  salesmanEmgContact: salesman.salesman_emg_contact,
                                  salesmanAddress: salesman.salesman_address,
                                  salesmanReference: salesman.salesman_reference || "",
                                });
                            }  setLoading(false);
                          });

                      } else {
                        reset(); 
                      }
                    }}
                  />
                )}
              />
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
         <div>
          <p  className="font-semibold">Salesman Name *</p>
          <input
            {...register("salesmanName", { required: true })}
            className="h-[50px] border-2 border-[#F3F6F8] rounded-lg p-3 w-md"
            placeholder="Enter Salesman name "
          />
          {errors.salesmanName && (
            <span className="text-red-500 text-sm">Required</span>
          )}
        </div>
        <div>
          <p className="font-semibold">Contact *</p>
          <input
            {...register("salesmanContact", { required: true })}
            className="h-[50px] border-2 border-[#F3F6F8] rounded-lg p-3 w-md"
            placeholder="Enter Salesman contact number "
            type='tel'
          />
          {errors.salesmanContact && (
            <span className="text-red-500 text-sm">Required</span>
          )}
        </div>
        </div>
        
         </form>
        </div>
    </main>
  )
}
