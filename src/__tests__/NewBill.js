/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import BillsUI from "../views/BillsUI.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import router from "../app/Router";
import userEvent from "@testing-library/user-event";
 
jest.mock("../app/store", () => mockStore)
 

/*  ============================= [AJOUT DE TESTS UNITAIRES ET D'INTEGRATION] - composant container/NewBill ======================================= */


 describe("Given I am connected as an employee", () => {
   Object.defineProperty(window, "localStorage", {
     value: localStorageMock,
   })
   window.localStorage.setItem(
     "user",
     JSON.stringify({
       type: "Employee",
     })
   )
   const root = document.createElement("div")
   root.setAttribute("id", "root")
   document.body.append(root)
   router()
 
   describe("When I am on NewBill Page", () => {
     test("Then mail icon in vertical layout should be highlighted", async () => {
       window.onNavigate(ROUTES_PATH.NewBill)
 
       await waitFor(() => screen.getByTestId("icon-mail"))
       const mailIcon = screen.getByTestId("icon-mail")
       expect(mailIcon.className).toBe("active-icon")
     })
   })
 
   describe("when I submit the form with empty fields", () => {
     test("then I should stay on new Bill page", () => {
       window.onNavigate(ROUTES_PATH.NewBill)
       const newBill = new NewBill({
         document,
         onNavigate,
         mockStore,
         localStorage: window.localStorage,
       })
 
       expect(screen.getByTestId("expense-name").value).toBe("")
       expect(screen.getByTestId("datepicker").value).toBe("")
       expect(screen.getByTestId("amount").value).toBe("")
       expect(screen.getByTestId("vat").value).toBe("")
       expect(screen.getByTestId("pct").value).toBe("")
       expect(screen.getByTestId("file").value).toBe("")
 
       const form = screen.getByTestId("form-new-bill")
       const handleSubmit = jest.fn((e) => newBill.handleSubmit(e))
 
       form.addEventListener("submit", handleSubmit)
       fireEvent.submit(form)
       expect(handleSubmit).toHaveBeenCalled()
       expect(form).toBeTruthy()
     })
   })

 
    describe("when I upload a file with the wrong format", () => {
     test("then it should display an error message", async () => {
       document.body.innerHTML = NewBillUI()
       const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

       const newBill = new NewBill({
         document,
         onNavigate,
         mockStore,
         localStorage: window.localStorage,
       })
 
       const invalidFile = new File(["invalid"], "invalid.txt", { type: "document/txt" })
       const inputFile = screen.getByTestId("file")
       
       const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))
       inputFile.addEventListener("change", handleChangeFile)
       
       fireEvent.change(inputFile, { target: { files: [invalidFile] } })
       
       expect(handleChangeFile).toHaveBeenCalled()
       const errorMessage = await screen.getByTestId('error-message')
       expect(errorMessage).toBeTruthy()

     })

     test("Then the file field should be empty", async () => {
       
       window.onNavigate(ROUTES_PATH.NewBill)
       const file = screen.getByTestId("file")

      const newBill = new NewBill({
        document, onNavigate, mockStore, localStorage
      })
      const handleChangeFile = jest.fn(() => {
        newBill.handleChangeFile
        return fileLabel
      })

      file.addEventListener("click", handleChangeFile)

      fireEvent.change(file, {
        target: { files: [new File(["justificatif"], "test.pdf", {type: "document/pdf"})] }
      })

      expect(file.value).toBe("")
    })
   }) 

 
   describe("when I upload a file with the good format", () => {
     test("then input file should show the file name", async () => {
       document.body.innerHTML = NewBillUI()
       const onNavigate = (pathname) => {
         document.body.innerHTML = ROUTES({ pathname })
       }
 
       const newBill = new NewBill({
         document,
         onNavigate,
         store: mockStore,
         localStorage: window.localStorage,
       })
 
       const file = new File(["img"], "image.png", { type: "image/png" })
       const inputFile = screen.getByTestId("file")
 
       const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))
       inputFile.addEventListener("change", handleChangeFile)
 
       userEvent.upload(inputFile, file)
 
       expect(handleChangeFile).toHaveBeenCalled()
       expect(inputFile.files[0]).toStrictEqual(file)
       expect(inputFile.files[0].name).toBe("image.png")
     })
   })
 })
 
 
 
//test d'intégration POST
 describe("When I submit the form", () => {
  test("a new bill have been added", async () => {

    document.body.innerHTML = NewBillUI()

    const onNavigate = (pathname) => {
         document.body.innerHTML = ROUTES({ pathname })
       }
 
    const newBill = new NewBill({
         document,
         onNavigate,
         store: mockStore,
         localStorage: window.localStorage,
      })

    const inputData = {
      type: "Transports",
      name: "Input test",
      datepicker: "2022-01-01",
      amount: "200",
      vat: "40",
      pct: "20",
      commentary: "Input test",
      file: new File(["test"], "test.png", { type: "image/png" }),
    };


    const form = screen.getByTestId("form-new-bill");
    const inputType = screen.getByTestId("expense-type");
    const inputName = screen.getByTestId("expense-name");
    const inputDate = screen.getByTestId("datepicker");
    const inputAmount = screen.getByTestId("amount");
    const inputVAT = screen.getByTestId("vat");
    const inputPCT = screen.getByTestId("pct");
    const inputComment = screen.getByTestId("commentary");
    const inputFile = screen.getByTestId("file");

    
    fireEvent.change(inputType, {
      target: { value: inputData.type },
    });
    expect(inputType.value).toBe(inputData.type);

    fireEvent.change(inputName, {
      target: { value: inputData.name },
    });
    expect(inputName.value).toBe(inputData.name);

    fireEvent.change(inputDate, {
      target: { value: inputData.datepicker },
    });
    expect(inputDate.value).toBe(inputData.datepicker);

    fireEvent.change(inputAmount, {
      target: { value: inputData.amount },
    });
    expect(inputAmount.value).toBe(inputData.amount);

    fireEvent.change(inputVAT, {
      target: { value: inputData.vat },
    });
    expect(inputVAT.value).toBe(inputData.vat);

    fireEvent.change(inputPCT, {
      target: { value: inputData.pct },
    });
    expect(inputPCT.value).toBe(inputData.pct);

    fireEvent.change(inputComment, {
      target: { value: inputData.commentary },
    });
    expect(inputComment.value).toBe(inputData.commentary);


    userEvent.upload(inputFile, inputData.file);
    expect(inputFile.files[0]).toStrictEqual(inputData.file);
    expect(inputFile.files).toHaveLength(1);

    const handleSubmit = jest.fn(newBill.handleSubmit);
    form.addEventListener("submit", handleSubmit);
    fireEvent.submit(form);
    expect(handleSubmit).toHaveBeenCalled();

    await waitFor( () => screen.getByText('Mes notes de frais'))
    const title = screen.getByText('Mes notes de frais')
    expect(title).toBeDefined()
    });
  });

  
  describe("When an error occurs on API", () => {

    beforeEach(() => {
      jest.spyOn(mockStore, "bills")
      Object.defineProperty(
        window,
        'localStorage',
        { value: localStorageMock }
      )
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "a@a"
      }))

      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.appendChild(root)
      router()
    })


  test("fetches bills from an API and fails with 404 message error", async () => {
    mockStore.bills.mockImplementationOnce(() => {
      return {
        list: () => {
          return Promise.reject(new Error("Erreur 404"))
        }
      }
    })

    document.body.innerHTML = BillsUI({ error: 'Erreur 404'})
    await new Promise(process.nextTick)
    const message = await screen.getByText(/Erreur 404/)

    expect(message).toBeTruthy()
  })


  test("fetches messages from an API and fails with 500 message error", async () => {
    mockStore.bills.mockImplementationOnce(() => {
      return {
        list: () => {
          return Promise.reject(new Error("Erreur 500"))
        }
      }
    })

    document.body.innerHTML = BillsUI({ error: 'Erreur 500'})
    await new Promise(process.nextTick)
    const message = await screen.getByText(/Erreur 500/)

    expect(message).toBeTruthy()
  })
})

/*  ============================= [AJOUT DE TESTS UNITAIRES ET D'INTEGRATION] - composant container/NewBill END ======================================= */
