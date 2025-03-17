import { useState, useEffect } from "react";
import { Button, FinanceCard, Input, Modal } from "../../components";
import { getFinancesData, onDeleteItem } from "../../services/request";

export const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const username = localStorage.getItem("@walletApp_name");
  const email = localStorage.getItem("@walletApp_email");
  const [financesData, setFinancesData] = useState([]);
  const [totalRevenues, setTotalRevenues] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [balance, setBalance] = useState(0);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const loadFinancesData = async (date) => {
    const result = await getFinancesData(date);

    const sortedData = result.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    setFinancesData(sortedData);

    const revenues = sortedData.filter((item) => Number(item.value) > 0);
    const expenses = sortedData.filter((item) => Number(item.value) < 0);

    const totalRev = revenues.reduce(
      (acc, item) => acc + Number(item.value),
      0
    );
    const totalExp = expenses.reduce(
      (acc, item) => acc + Number(item.value),
      0
    );

    setTotalRevenues(totalRev);
    setTotalExpenses(Math.abs(totalExp));
    setBalance(totalRev + totalExp);
  };

  useEffect(() => {
    loadFinancesData(selectedDate);
  }, [selectedDate]);

  const onDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const onClickAddButton = () => {
    setModalVisible(true);
  };

  const onCloseModal = () => {
    setModalVisible(false);
  };

  const handleFinanceAdded = () => {
    loadFinancesData(selectedDate);
  };

  const handleDeleteItem = async (id) => {
    try {
      await onDeleteItem(id);

      setFinancesData((prevData) => {
        const updatedData = prevData.filter((item) => item.id !== id);

        const revenues = updatedData.filter((item) => Number(item.value) > 0);
        const expenses = updatedData.filter((item) => Number(item.value) < 0);

        const totalRev = revenues.reduce(
          (acc, item) => acc + Number(item.value),
          0
        );
        const totalExp = expenses.reduce(
          (acc, item) => acc + Number(item.value),
          0
        );

        setTotalRevenues(totalRev);
        setTotalExpenses(Math.abs(totalExp));
        setBalance(totalRev + totalExp);

        return updatedData;
      });
    } catch (error) {
      alert("Erro ao deletar item.");
    }
  };

  return (
    <div className="w-dvw h-dvh flex flex-col items-start justify-start bg-gray-200">
      {/* Header */}
      <div className="w-dvw h-16 flex flex-row items-center justify-between py-6 px-28 bg-slate-50 max-lg:px-16 max-lg:py-5 max-md:px-8 max-md:py-4 max-sm:h-12 max-sm:px-4">
        <img
          className="w-auto h-6 max-lg:h-5 max-md:h-5"
          src="/images/logo.png"
          alt="logo"
        />
        <div className="w-64 flex flex-row items-center justify-center ml-48 max-lg:ml-16 max-lg:w-56 max-md:ml-8 max-md:w-48 max-sm:w-auto max-sm:ml-4 max-sm:mr-2">
          <Input
            className="w-40 h-11 text-center font-bold text-base max-lg:w-36 max-lg:h-10 max-md:w-36 max-md:h-10 max-md:text-sm max-sm:w-32 max-sm:h-8"
            type="date"
            value={selectedDate}
            onChange={onDateChange}
          />
        </div>
        <div className="w-64 h-full flex flex-row items-center justify-between max-lg:w-56 max-md:w-48 max-sm:w-auto max-sm:gap-3">
          <div className="w-12 h-12 flex items-center justify-center rounded-3xl bg-[#e4fde1] max-lg:w-10 max-lg:h-10 max-md:w-10 max-md:h-10 max-sm:w-6 max-sm:h-6">
            <h3 className="font-bold text-lg max-lg:text-base max-md:text-base max-sm:text-xs">
              {username?.charAt(0)}
            </h3>
          </div>
          <p className="font-medium text-sm text-gray-500 max-lg:text-sm max-md:text-xs max-sm:hidden">
            {email}
          </p>
          <a
            className="font-semibold text-sm underline hover:text-red-600 max-lg:text-sm max-md:text-xs"
            href="/"
          >
            sair
          </a>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="w-full mx-auto grid grid-cols-4 gap-4 py-8 px-28 max-2xl:px-12 max-lg:px-12 max-lg:py-6 max-lg:gap-4 max-lg:grid-cols-2 max-md:px-8 max-md:py-6 max-md:gap-3 max-sm:px-2 max-sm:py-1 max-sm:w-[95%]">
        <FinanceCard>
          <h3 className="font-bold text-center text-lg max-lg:text-base max-md:text-base max-sm:text-2xs">
            Total de lançamentos
          </h3>
          <p className="font-extrabold text-4xl mt-3 max-2xl:text-3xl max-lg:text-3xl max-lg:mt-2 max-md:text-2xl max-md:mt-2 max-sm:text-base max-sm:mt-0.5">
            {financesData.length}
          </p>
        </FinanceCard>
        <FinanceCard>
          <h3 className="font-bold text-center text-lg max-lg:text-base max-md:text-base max-sm:text-2xs">
            Receitas
          </h3>
          <p className="font-extrabold text-4xl mt-3 max-2xl:text-3xl max-lg:text-3xl max-lg:mt-2 max-md:text-2xl max-md:mt-2 max-sm:text-base max-sm:mt-0.5">
            {totalRevenues.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </FinanceCard>
        <FinanceCard>
          <h3 className="font-bold text-center text-lg max-lg:text-base max-md:text-base max-sm:text-2xs">
            Despesas
          </h3>
          <p className="font-extrabold text-4xl mt-3 max-2xl:text-3xl max-lg:text-3xl max-lg:mt-2 max-md:text-2xl max-md:mt-2 max-sm:text-base max-sm:mt-0.5">
            {totalExpenses.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </FinanceCard>
        <FinanceCard>
          <h3 className="font-bold text-center text-lg max-lg:text-base max-md:text-base max-sm:text-2xs">
            Balanço
          </h3>
          <p className="font-extrabold text-4xl mt-3 max-2xl:text-3xl max-lg:text-3xl max-lg:mt-2 max-md:text-2xl max-md:mt-2 max-sm:text-base max-sm:mt-0.5 text-violet-700">
            {balance.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </FinanceCard>
      </div>

      {/* Transactions List */}
      <div className="w-[90%] mx-auto flex flex-col rounded-3xl p-6 mb-4 max-sm:mb-2 bg-slate-50 overflow-hidden max-sm:w-[95%]">
        <div className="w-full h-20 flex flex-row sticky top-0  items-center justify-between pb-4 bg-slate-50 max-sm:h-16s">
          <h2 className="font-bold text-2xl max-lg:text-xl max-md:text-lg max-sm:text-base">
            Últimos lançamentos
          </h2>
          <Button onClick={onClickAddButton} variant="smallButton">
            Adicionar
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-6 pt-4">
          {financesData.length === 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <p className="font-bold text-lg text-gray-600 text-center max-lg:text-base max-md:text-sm">
                A lista está vazia. Para adicionar novos lançamentos, aperte no
                botão <span className="text-violet-700">Adicionar</span>.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop View */}
              <div className="hidden lg:block">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Título</th>
                      <th className="px-4 py-2">Categoria</th>
                      <th className="px-4 py-2 text-center">Data</th>
                      <th className="px-4 py-2 text-right">Valor</th>
                      <th className="px-4 py-2 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financesData.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-gray-100">
                        <td className="px-4 py-2">{item.title}</td>
                        <td className="px-4 py-2">{item.name}</td>
                        <td className="px-4 py-2 text-center">
                          {item.date
                            .split("T")[0]
                            .split("-")
                            .reverse()
                            .join("/")}
                        </td>
                        <td
                          className={`px-4 py-2 text-right ${
                            Number(item.value) < 0 ? "text-red-600" : ""
                          }`}
                        >
                          {Number(item.value).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </td>
                        <td className="px-4 py-2 text-right">
                          <button
                            className="text-violet-700 hover:underline"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            Deletar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View */}
              <div className="lg:hidden space-y-2">
                {financesData.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg p-4">
                    <div className="flex justify-between items-stretch">
                      <div>
                        <h3 className="font-medium text-base">{item.title}</h3>
                        <p className="text-sm text-gray-500">{item.name}</p>
                        <span className="text-sm text-gray-500 block mt-1">
                          {item.date
                            .split("T")[0]
                            .split("-")
                            .reverse()
                            .join("/")}
                        </span>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <span
                          className={`font-bold text-base ${
                            Number(item.value) < 0 ? "text-red-600" : ""
                          }`}
                        >
                          {Number(item.value).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </span>
                        <button
                          className="text-violet-700 hover:underline text-sm"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          Deletar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {modalVisible && (
        <Modal onClose={onCloseModal} onFinanceAdded={handleFinanceAdded} />
      )}
    </div>
  );
};
